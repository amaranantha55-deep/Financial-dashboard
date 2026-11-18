"""
Bilingual Financial Glossary (English & Hindi) for FinBot.
Provides educational definitions for Indian financial terms: EMI, SIP, FD, CAGR, etc.
"""

from typing import Dict, List, Optional
from .schemas import GlossaryItem

GLOSSARY_DATABASE: Dict[str, Dict[str, Dict[str, str]]] = {
    "EMI": {
        "en": {
            "term": "EMI",
            "full_form": "Equated Monthly Installment",
            "hindi_term": "समान मासिक किश्त",
            "definition": "A fixed monthly payment made by a borrower to a bank/lender on a specified date each month. Each installment is partitioned into paying off the accrued interest and repaying the principal loan balance."
        },
        "hi": {
            "term": "EMI",
            "full_form": "Equated Monthly Installment",
            "hindi_term": "समान मासिक किश्त",
            "definition": "ऋण (लोन) चुकाने के लिए बैंक या वित्तीय संस्थान को हर महीने दी जाने वाली एक निश्चित किश्त। इसमें मूलधन (Principal) का एक हिस्सा और संचित ब्याज (Interest) दोनों शामिल होते हैं।"
        }
    },
    "SIP": {
        "en": {
            "term": "SIP",
            "full_form": "Systematic Investment Plan",
            "hindi_term": "व्यवस्थित निवेश योजना",
            "definition": "An automated investment discipline allowing individuals to invest a fixed sum periodically (e.g. ₹1,000/month) into mutual funds. It reduces market timing risk through Rupee Cost Averaging and leverages compound growth over the long run."
        },
        "hi": {
            "term": "SIP",
            "full_form": "Systematic Investment Plan",
            "hindi_term": "व्यवस्थित निवेश योजना",
            "definition": "म्यूचुअल फंड में नियमित अंतराल (उदा. हर महीने ₹1,000) पर एक निश्चित राशि निवेश करने की अनुशासित विधि। यह बाजार के उतार-चढ़ाव में 'रुपया लागत औसत' (Rupee Cost Averaging) का लाभ देती है और चक्रवृद्धि ब्याज से दीर्घकाल में संपदा बनाती है।"
        }
    },
    "FD": {
        "en": {
            "term": "FD",
            "full_form": "Fixed Deposit",
            "hindi_term": "सावधि जमा",
            "definition": "A low-risk financial instrument provided by Indian banks and NBFCs where a lump-sum amount is deposited for a fixed tenure at a predetermined, guaranteed interest rate (typically compounded quarterly)."
        },
        "hi": {
            "term": "FD",
            "full_form": "Fixed Deposit",
            "hindi_term": "सावधि जमा",
            "definition": "बैंकों और डाकघरों द्वारा दी जाने वाली एक सुरक्षित निवेश योजना, जिसमें एकमुश्त पूंजी को निश्चित समय के लिए पूर्व-निर्धारित गारंटीड ब्याज दर पर जमा किया जाता है। भारतीय बैंकों में ब्याज आमतौर पर तिमाही (Quarterly) आधार पर जुड़ता है।"
        }
    },
    "CAGR": {
        "en": {
            "term": "CAGR",
            "full_form": "Compound Annual Growth Rate",
            "hindi_term": "चक्रवृद्धि वार्षिक वृद्धि दर",
            "definition": "The smoothed annualised rate of return that represents the geometric progression ratio of an investment growing from its beginning balance to its ending balance over multiple years, assuming all earnings are reinvested."
        },
        "hi": {
            "term": "CAGR",
            "full_form": "Compound Annual Growth Rate",
            "hindi_term": "चक्रवृद्धि वार्षिक वृद्धि दर",
            "definition": "कई वर्षों की अवधि में किसी निवेश पर मिलने वाली वास्तविक औसत वार्षिक वृद्धि दर। यह दर्शाता है कि यदि रिटर्न को हर साल दोबारा निवेश किया जाए, तो आपकी पूंजी सालाना किस स्थिर दर से बढ़ी है।"
        }
    },
    "50/30/20": {
        "en": {
            "term": "50/30/20 Rule",
            "full_form": "50/30/20 Budgeting Framework",
            "hindi_term": "50/30/20 बजट नियम",
            "definition": "A foundational rule of thumb allocating net monthly income: 50% for mandatory Needs (rent, groceries, utilities, basic insurance), 30% for discretionary Wants (dining, hobbies, travel), and 20% dedicated to Savings, debt prepayment, and long-term investments."
        },
        "hi": {
            "term": "50/30/20 Rule",
            "full_form": "50/30/20 Budgeting Framework",
            "hindi_term": "50/30/20 बजट नियम",
            "definition": "मासिक इन-हैंड आय को संतुलित करने का बुनियादी नियम: 50% अनिवार्य ज़रूरतों (किराया, राशन, बिजली बिल) के लिए, 30% जीवनशैली इच्छाओं (मनोरंजन, खान-पान) के लिए, और कम से कम 20% बचत एवं भविष्य के निवेश (SIP, आपातकालीन फंड) के लिए।"
        }
    },
    "EMERGENCY_FUND": {
        "en": {
            "term": "Emergency Fund",
            "full_form": "Contingency Safety Reserve",
            "hindi_term": "आपातकालीन सुरक्षा फंड",
            "definition": "A liquid reserve consisting of 3 to 6 months of living expenses parked in safe, accessible vehicles (high-yield savings accounts or liquid mutual funds) to cushion against unforeseen job losses, medical emergencies, or urgent repairs."
        },
        "hi": {
            "term": "Emergency Fund",
            "full_form": "Contingency Safety Reserve",
            "hindi_term": "आपातकालीन सुरक्षा फंड",
            "definition": "किसी अप्रत्याशित वित्तीय संकट (नौकरी जाना, बीमारी, ज़रूरी मरम्मत) से सुरक्षा हेतु 3 से 6 महीने के अनिवार्य खर्चों के बराबर लिक्विड फंड या बैंक में अलग रखी गई सुरक्षित पूंजी, जिसे बिना किसी नुकसान के तुरंत निकाला जा सके।"
        }
    },
    "DEBT_AVALANCHE": {
        "en": {
            "term": "Debt Avalanche",
            "full_form": "High-Interest First Debt Payoff Strategy",
            "hindi_term": "ऋण एवलांच रणनीति",
            "definition": "A mathematically optimal debt reduction method where extra payments are directed aggressively toward the account with the highest interest rate (e.g. credit cards at 36-42% APR) while servicing minimums on others, minimizing lifetime interest paid."
        },
        "hi": {
            "term": "Debt Avalanche",
            "full_form": "High-Interest First Debt Payoff Strategy",
            "hindi_term": "ऋण एवलांच रणनीति",
            "definition": "कर्ज़ से तेज़ी से मुक्ति पाने की सबसे किफायती गणितीय विधि। इसमें सबसे ऊंचे ब्याज दर वाले कर्ज़ (जैसे क्रेडिट कार्ड या पर्सनल लोन) को सबसे पहले अतिरिक्त राशि देकर चुकाया जाता है, जिससे ब्याज के हज़ारों-लाखों रुपये बचते हैं।"
        }
    }
}

TERM_TRIGGER_KEYWORDS = {
    "EMI": ["emi", "ईएमआई", "किश्त", "installment", "amortization"],
    "SIP": ["sip", "एसआईपी", "systematic investment", "म्यूचुअल फंड", "mutual fund"],
    "FD": ["fd", "एफडी", "fixed deposit", "सावधि जमा"],
    "CAGR": ["cagr", "सीएजीआर", "compound annual", "वार्षिक वृद्धि दर"],
    "50/30/20": ["50/30/20", "50-30-20", "budget rule", "बजट नियम"],
    "EMERGENCY_FUND": ["emergency fund", "आपातकालीन फंड", "सुरक्षा फंड", "safety net"],
    "DEBT_AVALANCHE": ["avalanche", "एवलांच", "snowball", "स्नोबॉल", "कर्ज", "debt payoff"]
}

def detect_glossary_terms(text: str) -> List[str]:
    """
    Identifies relevant financial terms mentioned in a text query.
    """
    t = text.lower()
    found: List[str] = []
    for term, keywords in TERM_TRIGGER_KEYWORDS.items():
        if any(kw in t for kw in keywords):
            found.append(term)
    return found

def get_glossary_items(terms: List[str], locale: str = "en") -> List[GlossaryItem]:
    """
    Returns GlossaryItem instances for the specified terms in the target locale.
    """
    loc = "hi" if locale == "hi" else "en"
    items: List[GlossaryItem] = []
    
    for term in terms:
        normalized = term.upper()
        if normalized == "50/30/20 RULE" or normalized == "50-30-20":
            normalized = "50/30/20"
        
        data = GLOSSARY_DATABASE.get(normalized, {}).get(loc)
        if not data:
            # Try case insensitive match in database keys
            for k, val in GLOSSARY_DATABASE.items():
                if k.lower() == term.lower():
                    data = val.get(loc)
                    break

        if data:
            items.append(GlossaryItem(
                term=data["term"],
                full_form=data["full_form"],
                hindi_term=data.get("hindi_term"),
                definition=data["definition"],
                locale=loc
            ))

    return items
