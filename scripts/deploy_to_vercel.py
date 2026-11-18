"""
Automated Vercel Deployment Script for FinBot.
Uses Vercel REST API v13 to deploy project files, track build logs, and return live URL.
"""

import os
import sys
import json
import time
import hashlib
import urllib.request
import urllib.error

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
VERCEL_TOKEN = os.getenv("VERCEL_TOKEN", "")
PROJECT_NAME = "finbot-finance-chatbot"
PROJECT_ID = "prj_EYoR3P5IeTeGVjCBEBcHCcehPYzV"

IGNORE_DIRS = {
    "node_modules", "dist", ".git", "__pycache__", ".venv", "venv", ".idea", ".vscode"
}
IGNORE_EXTS = {
    ".log", ".pyc", ".map"
}

def get_headers():
    return {
        "Authorization": f"Bearer {VERCEL_TOKEN}",
        "User-Agent": "FinBot-Deployer/1.0"
    }

def upload_file(content: bytes, sha: str) -> bool:
    """Uploads a file to Vercel file store if not already cached."""
    headers = get_headers()
    headers["Content-Type"] = "application/octet-stream"
    headers["Content-Length"] = str(len(content))
    headers["x-vercel-digest"] = sha

    req = urllib.request.Request("https://api.vercel.com/v2/files", data=content, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status == 200
    except urllib.error.HTTPError as e:
        if e.code == 409: # Already exists in Vercel cache
            return True
        print(f"Error uploading file (SHA: {sha}): {e.code} - {e.read().decode()}")
        return False

def collect_files():
    files_payload = []
    print(f"Scanning project files in {PROJECT_ROOT}...")

    for root, dirs, files in os.walk(PROJECT_ROOT):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for f in files:
            if any(f.endswith(ext) for ext in IGNORE_EXTS) or f.startswith(".env"):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, PROJECT_ROOT).replace("\\", "/")
            if rel_path.startswith("scripts/"):
                continue

            with open(full_path, "rb") as fp:
                data = fp.read()

            sha = hashlib.sha1(data).hexdigest()
            size = len(data)

            # Upload to Vercel
            upload_file(data, sha)

            files_payload.append({
                "file": rel_path,
                "sha": sha,
                "size": size
            })

    print(f"Successfully processed and uploaded {len(files_payload)} files.")
    return files_payload

def trigger_deployment(files_payload):
    print(f"Triggering production deployment on project '{PROJECT_NAME}'...")
    url = "https://api.vercel.com/v13/deployments"

    body = {
        "name": PROJECT_NAME,
        "project": PROJECT_ID,
        "target": "production",
        "files": files_payload,
        "projectSettings": {
            "framework": "vite",
            "buildCommand": "npm run build",
            "outputDirectory": "dist"
        }
    }

    payload_bytes = json.dumps(body).encode("utf-8")
    headers = get_headers()
    headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=payload_bytes, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            return data
    except urllib.error.HTTPError as e:
        print(f"Deployment Trigger Error: {e.code} - {e.read().decode()}")
        sys.exit(1)

def poll_deployment(deployment_id: str):
    print(f"Polling deployment status for ID: {deployment_id}...")
    headers = get_headers()

    while True:
        req = urllib.request.Request(f"https://api.vercel.com/v13/deployments/{deployment_id}", headers=headers)
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                status = data.get("readyState") or data.get("status")
                print(f"  -> State: {status} (URL: https://{data.get('url')})")

                if status in ("READY", "ERROR", "CANCELED"):
                    return data
        except urllib.error.HTTPError as e:
            print(f"Poll Error: {e.code}")

        time.sleep(3)

def main():
    print("=" * 60)
    print("🚀 FINBOT VERCEL AUTOMATED PRODUCTION DEPLOYMENT")
    print("=" * 60)

    files_payload = collect_files()
    deployment = trigger_deployment(files_payload)

    dep_id = deployment.get("id")
    dep_url = deployment.get("url")
    print(f"\nDeployment Created!")
    print(f"Deployment ID:  {dep_id}")
    print(f"Preview URL:    https://{dep_url}")

    final_result = poll_deployment(dep_id)
    state = final_result.get("readyState") or final_result.get("status")

    print("\n" + "=" * 60)
    if state == "READY":
        prod_alias = f"https://{PROJECT_NAME}.vercel.app"
        print("🎉 DEPLOYMENT SUCCEEDED!")
        print(f"Production URL: {prod_alias}")
        print(f"Deployment URL: https://{final_result.get('url')}")
        print("=" * 60)
    else:
        print(f"❌ Deployment ended in state: {state}")
        print(f"Inspector: https://vercel.com/{final_result.get('ownerId')}/{PROJECT_NAME}/{dep_id}")
        print("=" * 60)

if __name__ == "__main__":
    main()

