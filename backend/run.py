import uvicorn
import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"🚀 Starting FinBot FastAPI Backend on http://127.0.0.1:{port} ...")
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)

