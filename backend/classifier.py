"""
Intent Classifier & Entity Extractor for FinBot.
Supports:
- Intents: 'budget', 'loan', 'savings', 'investment', 'planning', 'debt', 'out-of-scope'
- Entity Extraction: 'amount', 'rate', 'tenure', 'income'
- Hindi & English language detection
- Terms detection for glossary: 'EMI', 'SIP', 'FD', 'CAGR', '50/30/20', etc.
- LLM JSON-mode classification with Claude API and high-accuracy deterministic fallback
"""

import os
import re
import json
from typing import List, Dict, Any, Optional, Tuple
from .schemas import ExtractedEntities, IntentClassification
from .glossary import detect_glossary_terms

REQUIRED_ENTITIES_BY_INTENT = {
    "loan": ["amount", "rate", "tenure"],
    "budget": ["income"],
    "investment": ["amount", "rate", "tenure"],
    "savings": ["amount"],
    "debt": ["amount", "rate"],
    "planning": ["income"],
    "out-of-scope": []
}

HINDI_UNICODE_PATTERN = re.compile(r"[\u0900-\u097F]")
HINDI_KEYWORDS = {
    "kya", "kaise", "kitna", "kitne", "kitni", "chahiye", "batao", "karo", "hoga", "hogi",
    "hai", "hain", "banaen", "bachat", "byaj", "rin", "yojana", "kharch", "nivesh",
    "mahine", "saal", "rupaye", "lakh", "crore", "paisa", "kamai", "vetan", "karz",
    "chuka", "namaste", "dhanyawad", "aap", "mera", "meri", "mere", "mujhe"
}

OUT_OF_SCOPE_TRIGGERS = [
    # Non-financial topics
    "recipe", "cook", "weather", "cricket", "football", "code", "python", "javascript",
    "movie", "song", "joke", "doctor", "medicine", "symptom", "politics", "election",
    # Specific individual stock / crypto buy-sell tips (SEBI violation prevention)
    "which stock to buy", "penny stock", "stock tip", "crypto tip", "buy or sell",
    "target price", "intraday", "option tip", "call or put", "multibagger tip",
    "कौन सा शेयर खरीदें", "पेनी स्टॉक", "ट्रेडिंग टिप"
]

def detect_language(text: str, fallback_locale: str = "en") -> str:
    """
    Detects if query is in Hindi (Devanagari or Romanized Hinglish) or English.
    """
    if not text:
        return fallback_locale

    # Check for Devanagari characters
    if HINDI_UNICODE_PATTERN.search(text):
        return "hi"

    # Check for Hinglish words
    words = re.findall(r"\b[a-zA-Z]+\b", text.lower())
    hindi_matches = sum(1 for w in words if w in HINDI_KEYWORDS)
    if hindi_matches >= 2 or (len(words) <= 4 and hindi_matches >= 1):
        return "hi"

    return fallback_locale if fallback_locale in ("en", "hi") else "en"


def parse_indian_number(text: str) -> Optional[float]:
    """
    Converts Indian numbering text into float:
    e.g. '10 lakh' -> 1,000,000; '1.5 cr' -> 15,000,000; '50k' -> 50,000; '25,00,000' -> 2500000
    """
    cleaned = text.strip().lower().replace("₹", "").replace("rs", "").replace("inr", "").strip()

    # Match crore
    cr_match = re.search(r"([\d\.]+)\s*(?:cr|crore|करोड़)", cleaned)
    if cr_match:
        try:
            return float(cr_match.group(1)) * 10000000.0
        except ValueError:
            pass

    # Match lakh
    lakh_match = re.search(r"([\d\.]+)\s*(?:lakh|lakhs|lac|lacs|l\b|लाख)", cleaned)
    if lakh_match:
        try:
            return float(lakh_match.group(1)) * 100000.0
        except ValueError:
            pass

    # Match thousand (k)
    k_match = re.search(r"([\d\.]+)\s*(?:k|thousand|हज़ार)", cleaned)
    if k_match:
        try:
            return float(k_match.group(1)) * 1000.0
        except ValueError:
            pass

    # Match raw comma-separated or integer numbers
    num_match = re.search(r"(\d{1,3}(?:,\d{2,3})+|\d{4,})", cleaned)
    if num_match:
        try:
            return float(num_match.group(1).replace(",", ""))
        except ValueError:
            pass

    return None


def extract_entities_deterministic(text: str) -> ExtractedEntities:
    """
    Deterministic rule-based extractor for amount, rate, tenure, and income.
    """
    t = text.lower()
    entities = ExtractedEntities()

    # 1. Rate extraction: e.g. '8.5%', '9.5 percent', '8.5 प्रतिशत', 'at 8.5%'
    rate_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:%|percent|प्रतिशत|p\.?a\.?|p\.?m\.?)", t)
    if rate_match:
        try:
            r = float(rate_match.group(1))
            if 0.5 <= r <= 100.0:
                entities.rate = r
        except ValueError:
            pass

    # 2. Tenure extraction: e.g. '15 years', '5 yrs', '10 saal', '15 वर्ष', '24 months'
    year_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:years|year|yrs|yr|saal|साल|वर्ष)", t)
    if year_match:
        try:
            entities.tenure = float(year_match.group(1))
        except ValueError:
            pass
    else:
        month_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:months|month|mahine|महीने|माह)", t)
        if month_match:
            try:
                entities.tenure = round(float(month_match.group(1)) / 12.0, 2)
            except ValueError:
                pass

    # 3. Income extraction: e.g. 'income of 1 lakh', 'earning 75000', 'salary 1.2L', '1 lakh/month', 'आय ₹1,00,000'
    income_match = re.search(
        r"(?:income|salary|earning|earns|earn|आय|वेतन|कमाई)\s*(?:of|is|:)?\s*([₹\d\.,\s]+(?:lakh|lakhs|lac|k|cr|करोड़|लाख)?)",
        t
    )
    if income_match:
        parsed_inc = parse_indian_number(income_match.group(1))
        if parsed_inc and parsed_inc >= 5000:
            entities.income = parsed_inc

    # 4. Amount extraction (principal, target, debt, lumpsum/SIP)
    # Check explicitly labelled amounts: 'loan of 25 lakh', 'target 5 lakh', 'debt of 3 lakh', 'invest 10000'
    amount_match = re.search(
        r"(?:loan|principal|amount|target|debt|invest|sip|fd|कर्ज|लोन|ऋण|लक्ष्य)\s*(?:of|is|:)?\s*([₹\d\.,\s]+(?:lakh|lakhs|lac|k|cr|करोड़|लाख)?)",
        t
    )
    if amount_match:
        parsed_amt = parse_indian_number(amount_match.group(1))
        if parsed_amt:
            entities.amount = parsed_amt

    # If amount is still None, scan for any currency pattern not already captured by income
    if entities.amount is None:
        raw_amt = parse_indian_number(t)
        if raw_amt and raw_amt != entities.income:
            entities.amount = raw_amt

    return entities


def classify_deterministic(query: str, fallback_locale: str = "en") -> IntentClassification:
    """
    High-accuracy deterministic intent classifier and entity extractor.
    """
    q = query.lower().strip()
    detected_lang = detect_language(query, fallback_locale)
    entities = extract_entities_deterministic(query)

    # 1. Out-of-scope check
    if any(trigger in q for trigger in OUT_OF_SCOPE_TRIGGERS):
        return IntentClassification(
            intent="out-of-scope",
            confidence=0.98,
            language=detected_lang,
            entities=entities,
            missing_entities=[],
            terms_to_define=[]
        )

    # 2. Intent detection
    intent = "out-of-scope"
    confidence = 0.85

    if any(k in q for k in ("budget", "50/30/20", "50-30-20", "बजट", "spend", "expense", "खर्च", "income allocation")):
        intent = "budget"
        confidence = 0.95
    elif any(k in q for k in ("emi", "loan", "लोन", "ऋण", "mortgage", "interest", "ईएमआई", "किश्त", "home loan", "car loan")):
        intent = "loan"
        confidence = 0.98
    elif any(k in q for k in ("save", "saving", "emergency", "बचत", "आपातकालीन", "safety net", "emergency fund")):
        intent = "savings"
        confidence = 0.92
    elif any(k in q for k in ("sip", "fd", "invest", "investment", "compounding", "cagr", "एसआईपी", "म्यूचुअल फंड", "निवेश", "fixed deposit")):
        intent = "investment"
        confidence = 0.96
    elif any(k in q for k in ("debt", "payoff", "avalanche", "snowball", "credit card", "कर्ज", "ऋण मुक्ति")):
        intent = "debt"
        confidence = 0.94
    elif any(k in q for k in ("plan", "planning", "retire", "retirement", "wealth", "वित्तीय योजना", "पोर्टफोलियो")):
        intent = "planning"
        confidence = 0.90
    else:
        # Check if financial numbers/words exist
        if entities.amount or entities.rate or entities.income:
            intent = "loan" if (entities.rate and entities.tenure) else "planning"
            confidence = 0.75

    # 3. Determine missing entities
    required = REQUIRED_ENTITIES_BY_INTENT.get(intent, [])
    missing: List[str] = []
    for req in required:
        val = getattr(entities, req, None)
        if val is None or val <= 0:
            missing.append(req)

    # 4. Detect glossary terms
    terms = detect_glossary_terms(query)
    # Automatically add prominent intent terms if not already present
    if intent == "loan" and "EMI" not in terms:
        terms.append("EMI")
    elif intent == "investment" and "SIP" not in terms:
        terms.append("SIP")
    elif intent == "budget" and "50/30/20" not in terms:
        terms.append("50/30/20")
    elif intent == "savings" and "EMERGENCY_FUND" not in terms:
        terms.append("EMERGENCY_FUND")
    elif intent == "debt" and "DEBT_AVALANCHE" not in terms:
        terms.append("DEBT_AVALANCHE")

    return IntentClassification(
        intent=intent,
        confidence=confidence,
        language=detected_lang,
        entities=entities,
        missing_entities=missing,
        terms_to_define=terms
    )


async def classify_with_llm(
    message: str,
    history: Optional[List[Dict[str, str]]] = None,
    preferred_locale: str = "en"
) -> IntentClassification:
    """
    Classifies user message intent and extracts entities via Claude API returning JSON.
    Gracefully falls back to deterministic classification if offline or key is missing.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return classify_deterministic(message, preferred_locale)

    system_prompt = (
        "You are the NLU classifier and entity extractor for FinBot, an educational personal finance bot for Indian users.\n"
        "Your task is to classify the user's intent, extract entities, detect language, identify missing entities, and identify relevant financial terms.\n\n"
        "ALLOWED INTENTS:\n"
        "- 'budget': 50/30/20 framework, monthly expense allocation, savings ratio. Required: ['income']\n"
        "- 'loan': EMI calculations, loan interest, tenure, amortization. Required: ['amount', 'rate', 'tenure']\n"
        "- 'savings': Emergency fund, target savings milestones. Required: ['amount']\n"
        "- 'investment': SIP, Fixed Deposit (FD), mutual funds, CAGR, wealth growth. Required: ['amount', 'rate', 'tenure']\n"
        "- 'planning': Comprehensive financial roadmap, retirement. Required: ['income']\n"
        "- 'debt': Debt payoff, Avalanche/Snowball, credit card debt. Required: ['amount', 'rate']\n"
        "- 'out-of-scope': Non-financial topics (recipes, coding, trivia) OR SPECIFIC individual stock/crypto picks (e.g. 'which stock to buy tomorrow', 'penny stock tip') which violate SEBI educational guidelines. Required: []\n\n"
        "ENTITIES TO EXTRACT:\n"
        "- 'amount': principal / loan / target / investment / debt amount in INR (convert '10 lakh' to 1000000, '1.5 cr' to 15000000, '50k' to 50000)\n"
        "- 'rate': annual percentage (e.g. 8.5% -> 8.5)\n"
        "- 'tenure': duration in years (e.g. '15 years' -> 15.0, '24 months' -> 2.0)\n"
        "- 'income': net monthly income in INR\n\n"
        "LANGUAGE DETECTION:\n"
        "- 'hi' if the user writes in Devanagari Hindi or Romanized Hinglish (e.g. 'loan ka emi kitna hoga')\n"
        "- 'en' if English\n\n"
        "TERMS TO DEFINE:\n"
        "List any financial acronyms/terms relevant to this query, e.g. ['EMI', 'SIP', 'FD', 'CAGR', '50/30/20', 'EMERGENCY_FUND', 'DEBT_AVALANCHE'].\n\n"
        "OUTPUT FORMAT:\n"
        "You MUST respond ONLY with a valid JSON object matching this schema, with no surrounding markdown or explanation:\n"
        "{\n"
        '  "intent": "loan" | "budget" | "savings" | "investment" | "planning" | "debt" | "out-of-scope",\n'
        '  "confidence": 0.95,\n'
        '  "language": "en" | "hi",\n'
        '  "entities": {\n'
        '    "amount": float or null,\n'
        '    "rate": float or null,\n'
        '    "tenure": float or null,\n'
        '    "income": float or null\n'
        '  },\n'
        '  "missing_entities": ["amount", "rate", "tenure"],\n'
        '  "terms_to_define": ["EMI"]\n'
        "}"
    )

    try:
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=api_key)

        msgs: List[Dict[str, Any]] = []
        if history:
            for h in history[-4:]:
                msgs.append({"role": h.get("role", "user"), "content": h.get("content", "")})
        msgs.append({"role": "user", "content": message})

        response = await client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=300,
            temperature=0.0,
            system=system_prompt,
            messages=msgs
        )

        raw_text = "".join(c.text for c in response.content if c.type == "text").strip()
        # Strip potential markdown code blocks
        if raw_text.startswith("```"):
            raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
            raw_text = re.sub(r"\s*```$", "", raw_text)

        data = json.loads(raw_text)
        ent_data = data.get("entities", {})

        entities = ExtractedEntities(
            amount=ent_data.get("amount"),
            rate=ent_data.get("rate"),
            tenure=ent_data.get("tenure"),
            income=ent_data.get("income"),
        )

        intent = data.get("intent", "out-of-scope")
        if intent not in REQUIRED_ENTITIES_BY_INTENT:
            intent = "out-of-scope"

        # Double check missing entities
        required = REQUIRED_ENTITIES_BY_INTENT.get(intent, [])
        missing = [
            req for req in required
            if getattr(entities, req, None) is None or getattr(entities, req, 0) <= 0
        ]

        lang = data.get("language", preferred_locale)
        if lang not in ("en", "hi"):
            lang = detect_language(message, preferred_locale)

        terms = data.get("terms_to_define", [])
        if not terms:
            terms = detect_glossary_terms(message)

        return IntentClassification(
            intent=intent,
            confidence=float(data.get("confidence", 0.9)),
            language=lang,
            entities=entities,
            missing_entities=missing,
            terms_to_define=terms
        )

    except Exception as err:
        print(f"[FinBot Classifier] Claude classification error: {err}. Using deterministic fallback.")
        return classify_deterministic(message, preferred_locale)

