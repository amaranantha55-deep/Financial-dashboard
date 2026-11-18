"""
Comprehensive Python Test Suite for FinBot Backend:
- Intent Classification
- Entity Extraction (Indian currency, rates, tenures)
- Missing Entity Detection & InlineForm response (zero guessing)
- Hindi Language Detection & Glossary lookup for EMI and SIP
"""

import os
import sys

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from backend.main import app
from backend.classifier import classify_deterministic, detect_language, extract_entities_deterministic
from backend.glossary import get_glossary_items

def test_language_detection():
    assert detect_language("Calculate loan EMI") == "en"
    assert detect_language("मुझे लोन की ईएमआई निकालनी है") == "hi"
    assert detect_language("loan ka emi kitna hoga bhai") == "hi"
    print("✔ test_language_detection passed")

def test_entity_extraction():
    e = extract_entities_deterministic("Loan of 25 lakh at 8.5% for 15 years with income of 1.5 lakh")
    assert e.amount == 2500000.0, f"Amount: {e.amount}"
    assert e.rate == 8.5, f"Rate: {e.rate}"
    assert e.tenure == 15.0, f"Tenure: {e.tenure}"
    assert e.income == 150000.0, f"Income: {e.income}"
    print("✔ test_entity_extraction passed")

def test_missing_entities_loan():
    client = TestClient(app)
    # Query with missing entities -> must return InlineForm, never guess!
    res = client.post("/chat", json={"message": "Calculate my loan EMI"})
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] == "loan"
    assert len(data["components"]) == 1
    assert data["components"][0]["type"] == "InlineForm"
    missing = data["components"][0]["props"]["missingFields"]
    assert "amount" in missing and "rate" in missing and "tenure" in missing
    assert any(g["term"] == "EMI" for g in data["glossary"])
    print("✔ test_missing_entities_loan passed")

def test_missing_entities_budget():
    client = TestClient(app)
    # Query with missing income
    res = client.post("/chat", json={"message": "Plan my monthly budget"})
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] == "budget"
    assert data["components"][0]["type"] == "InlineForm"
    assert "income" in data["components"][0]["props"]["missingFields"]
    print("✔ test_missing_entities_budget passed")

def test_out_of_scope():
    client = TestClient(app)
    res = client.post("/chat", json={"message": "Which penny stock should I buy for 10x returns tomorrow?"})
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] == "out-of-scope"
    assert len(data["components"]) == 0
    assert "SEBI" in data["text"]
    print("✔ test_out_of_scope passed")

def test_complete_calculation_loan():
    client = TestClient(app)
    res = client.post("/chat", json={"message": "Calculate EMI for 10 lakh at 9.5% for 5 years"})
    assert res.status_code == 200
    data = res.json()
    assert data["intent"] == "loan"
    assert data["components"][0]["type"] == "EmiCalculatorCard"
    assert data["formula"] is not None
    assert any(g["term"] == "EMI" for g in data["glossary"])
    print("✔ test_complete_calculation_loan passed")

def test_hindi_support_and_glossary():
    client = TestClient(app)
    res = client.post("/chat", json={"message": "मुझे 25 लाख के लोन पर 8.5% ब्याज से 15 साल की ईएमआई निकालनी है"})
    assert res.status_code == 200
    data = res.json()
    assert data["language"] == "hi"
    assert data["components"][0]["type"] == "EmiCalculatorCard"
    emi_term = next(g for g in data["glossary"] if g["term"] == "EMI")
    assert emi_term["hindi_term"] == "समान मासिक किश्त"
    print("✔ test_hindi_support_and_glossary passed")

if __name__ == "__main__":
    print("Running FinBot Backend Test Suite...")
    test_language_detection()
    test_entity_extraction()
    test_missing_entities_loan()
    test_missing_entities_budget()
    test_out_of_scope()
    test_complete_calculation_loan()
    test_hindi_support_and_glossary()
    print("\n🎉 ALL 7 Python backend tests passed successfully!")
