"""
FastAPI Backend for FinBot with Claude API Tool Calling, SSE Streaming,
Intent Classification, Entity Extraction, InlineForm Fallback, and Hindi Glossary.

System Prompt:
"You are FinBot, an educational financial assistant for Indian users. Never give specific stock/fund picks. Always state assumptions. Use INR and Indian number format. Reply in the user's language."
"""

import os
import json
import asyncio
from typing import List, Dict, Any, Optional, AsyncGenerator

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from dotenv import load_dotenv

from .schemas import ChatRequest, BotResponse, BotComponent, GlossaryItem
from .tools import CLAUDE_TOOLS, execute_tool
from .classifier import classify_with_llm, classify_deterministic, detect_language
from .glossary import get_glossary_items, detect_glossary_terms

# Load environment variables from .env file
load_dotenv()

SYSTEM_PROMPT = (
    "You are FinBot, an educational financial assistant for Indian users. "
    "Never give specific stock/fund picks. Always state assumptions. "
    "Use INR and Indian number format. Reply in the user's language."
)

app = FastAPI(
    title="FinBot Financial AI API",
    version="2.1.0",
    description="AI financial copilot backend with Intent Classification, Entity Extraction, and Hindi Glossary"
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.get("/api")
def health_check():
    return {
        "status": "online",
        "service": "FinBot Financial Copilot API",
        "version": "2.1.0",
        "claude_api_configured": bool(os.getenv("ANTHROPIC_API_KEY"))
    }


def generate_response_from_intent(
    query: str,
    classification,
    locale: str = "en"
) -> BotResponse:
    """
    Constructs a deterministic BotResponse based on classified intent and extracted entities.
    If entities are missing, returns an InlineForm component instead of guessing.
    """
    lang = classification.language or locale
    is_hi = (lang == "hi")
    glossary_items = get_glossary_items(classification.terms_to_define, locale=lang)

    # 1. Out-of-Scope Handling
    if classification.intent == "out-of-scope":
        text = (
            "नमस्ते! FinBot विशेष रूप से भारतीय व्यक्तिगत वित्त (Personal Finance) के लिए एक शैक्षणिक सहायक है।\n\n"
            "- ⚖️ **SEBI शैक्षणिक दिशा-निर्देश**: मैं किसी विशिष्ट शेयर, क्रिप्टोकरेंसी या सट्टा ट्रेडिंग की सिफारिशें (Buy/Sell Tips) नहीं देता।\n"
            "- 📊 **मैं इनमें आपकी सहायता कर सकता हूँ**:\n"
            "  1. 🏠 **50/30/20 मासिक बजट योजना**\n"
            "  2. 💳 **लोन ईएमआई (EMI) व परिशोधन तालिका**\n"
            "  3. 📈 **SIP बनाम बैंक FD वेल्थ मॉडलिंग**\n"
            "  4. 🛡️ **आपातकालीन सुरक्षा फंड व बचत लक्ष्य**\n"
            "  5. ⚡ **कर्ज मुक्ति (Debt Avalanche) रणनीति**\n\n"
            "शुरू करने के लिए कृपया नीचे दिए गए सुझावों में से चुनें या अपना वित्तीय प्रश्न पूछें!"
            if is_hi else
            "Hello! FinBot is an educational copilot designed specifically for Indian personal finance.\n\n"
            "- ⚖️ **Regulatory Compliance (SEBI)**: In line with educational guidelines, I do not provide specific individual stock tips, crypto recommendations, or speculative trading calls.\n"
            "- 📊 **I can help you model and optimize**:\n"
            "  1. 🏠 **50/30/20 Monthly Budgeting**\n"
            "  2. 💳 **Loan EMI & Amortization Schedules**\n"
            "  3. 📈 **Disciplined SIP vs FD Wealth Modeling**\n"
            "  4. 🛡️ **Emergency Fund Planning**\n"
            "  5. ⚡ **Debt Avalanche Payoff Strategy**\n\n"
            "Please select a topic below or enter your financial details to get started!"
        )
        chips = [
            "Plan my monthly budget", "Calculate loan EMI", "SIP vs FD comparison", "Assess investment risk"
        ] if not is_hi else [
            "मासिक 50/30/20 बजट बनाएं", "लोन ईएमआई निकालें", "SIP बनाम FD तुलना", "जोखिम प्रोफाइल जांचें"
        ]
        return BotResponse(
            text=text,
            components=[],
            chips=chips,
            assumptions=[],
            formula=None,
            intent="out-of-scope",
            language=lang,
            glossary=glossary_items
        )

    # 2. Missing Entities -> Return InlineForm component instead of guessing!
    if classification.missing_entities:
        intent_titles_en = {
            "loan": "Loan EMI Calculator Form",
            "budget": "Monthly Income & Budget Form",
            "investment": "SIP & Wealth Investment Form",
            "savings": "Savings Goal & Safety Net Form",
            "debt": "Debt Avalanche Payoff Form",
            "planning": "Financial Profile & Planning Form"
        }
        intent_titles_hi = {
            "loan": "ऋण ईएमआई (EMI) विवरण फॉर्म",
            "budget": "मासिक आय एवं बजट विवरण फॉर्म",
            "investment": "एसआईपी (SIP) निवेश योजना फॉर्म",
            "savings": "बचत लक्ष्य एवं सुरक्षा फंड फॉर्म",
            "debt": "कर्ज मुक्ति (Debt Payoff) फॉर्म",
            "planning": "वित्तीय प्रोफाइल एवं योजना फॉर्म"
        }
        title = (intent_titles_hi if is_hi else intent_titles_en).get(classification.intent, "Financial Details Form")

        missing_labels_hi = {
            "amount": "राशि (Amount)",
            "rate": "ब्याज / रिटर्न दर (Rate %)",
            "tenure": "समय-अवधि (Tenure in Years)",
            "income": "मासिक आय (Monthly Income)"
        }
        missing_labels_en = {
            "amount": "Principal / Amount",
            "rate": "Interest / Return Rate (%)",
            "tenure": "Tenure (Years)",
            "income": "Monthly Income"
        }
        dict_labels = missing_labels_hi if is_hi else missing_labels_en
        missing_str = ", ".join(dict_labels.get(m, m) for m in classification.missing_entities)

        text = (
            f"सटीक वित्तीय गणना के लिए बिना किसी अनुमान के मुझे कुछ विवरण चाहिए (अपेक्षित: **{missing_str}**)।\n\n"
            f"कृपया नीचे दिए गए इंटरएक्टिव **{title}** में विवरण भरें ताकि मैं सटीक किश्त, ब्याज और चार्ट प्रस्तुत कर सकूँ:"
            if is_hi else
            f"To provide an accurate calculation without guessing, I need a few key details (required: **{missing_str}**).\n\n"
            f"Please fill in the interactive **{title}** below so I can compute your exact numbers and charts:"
        )

        form_component = BotComponent(
            type="InlineForm",
            props={
                "intent": classification.intent,
                "title": title,
                "missingFields": classification.missing_entities,
                "prefilledValues": {
                    "amount": classification.entities.amount,
                    "rate": classification.entities.rate,
                    "tenure": classification.entities.tenure,
                    "income": classification.entities.income,
                },
                "locale": lang
            }
        )

        chips = [
            f"Submit {classification.intent} details",
            "Why is this required?",
            "Start a different topic"
        ] if not is_hi else [
            f"{title} भरें",
            "यह विवरण क्यों आवश्यक है?",
            "अन्य विषय चुनें"
        ]

        return BotResponse(
            text=text,
            components=[form_component],
            chips=chips,
            assumptions=[
                "No arbitrary numbers assumed: prompting for exact user inputs via InlineForm"
                if not is_hi else
                "कोई मनमाना अनुमान नहीं: गणितीय सटीकता हेतु फॉर्म से सटीक आंकड़े मांगे गए हैं"
            ],
            formula=None,
            intent=classification.intent,
            language=lang,
            glossary=glossary_items
        )

    # 3. All required entities are present: Execute matching mathematical tool
    components: List[BotComponent] = []
    assumptions: List[str] = []
    formula: Optional[str] = None
    chips: List[str] = []
    text = ""

    if classification.intent == "budget":
        inc = classification.entities.income or 100000.0
        raw_res, comp, f_str, assump = execute_tool("calculate_budget_503020", {"monthly_income": inc}, lang)
        components.append(BotComponent(**comp))
        formula = f_str
        assumptions = assump
        chips = ["How to cut ₹5,000 from wants?", "Grocery saving tips", "Change income to ₹1.5 Lakhs"] if not is_hi else ["इच्छाओं से ₹5,000 कैसे कम करें?", "राशन बिल बचत टिप्स", "आय ₹1.5 लाख करें"]
        text = (
            f"मैंने आपकी **₹{inc:,.0f}/माह** की आय हेतु संतुलित **50/30/20 बजट योजना** तैयार की है:\n\n"
            f"- 🏠 **ज़रूरतें (50%)**: ₹{raw_res['needs']:,.0f}\n"
            f"- ☕ **इच्छाएं (30%)**: ₹{raw_res['wants']:,.0f}\n"
            f"- 💎 **बचत एवं निवेश (20%)**: ₹{raw_res['savings']:,.0f}\n\n"
            f"नीचे दिए गए डोनट चार्ट में आप प्रतिशत अनुपात को अपनी आवश्यकतानुसार समायोजित कर सकते हैं:"
            if is_hi else
            f"I have modeled a balanced **50/30/20 monthly budget** for your **₹{inc:,.0f}/month** net income:\n\n"
            f"- 🏠 **Needs (50%)**: ₹{raw_res['needs']:,.0f}\n"
            f"- ☕ **Wants (30%)**: ₹{raw_res['wants']:,.0f}\n"
            f"- 💎 **Savings & Wealth (20%)**: ₹{raw_res['savings']:,.0f}\n\n"
            f"You can adjust the sliders directly in the interactive donut chart below:"
        )

    elif classification.intent == "loan":
        p = classification.entities.amount or 2500000.0
        r = classification.entities.rate or 8.5
        t = classification.entities.tenure or 15.0
        raw_res, comp, f_str, assump = execute_tool("calculate_emi", {"principal": p, "annual_rate": r, "tenure_years": t}, lang)
        components.append(BotComponent(**comp))
        formula = f_str
        assumptions = assump
        chips = ["What if interest drops by 0.5%?", "10-year vs 15-year tenure", "Effect of ₹2 Lakh prepayment"] if not is_hi else ["यदि ब्याज 0.5% घट जाए?", "10 वर्ष बनाम 15 वर्ष", "₹2 लाख पूर्व-भुगतान प्रभाव"]
        text = (
            f"**₹{p:,.0f}** के ऋण पर **{r}%** वार्षिक ब्याज दर से **{t:g} वर्ष** हेतु आपकी मासिक **EMI ₹{raw_res['result']:,.0f}/माह** बनती है।\n\n"
            f"- कुल देय ब्याज: **₹{raw_res['total_interest']:,.0f}**\n"
            f"- कुल भुगतान (मूलधन + ब्याज): **₹{raw_res['total_payment']:,.0f}**\n\n"
            f"नीचे दिए गए ईएमआई कैलकुलेटर कार्ड में आप अतिरिक्त भुगतान और परिशोधन तालिका (Amortization) देख सकते हैं:"
            if is_hi else
            f"For a loan of **₹{p:,.0f}** at **{r}%** annual interest over **{t:g} years**, your monthly **EMI is ₹{raw_res['result']:,.0f}/month**.\n\n"
            f"- Total Interest Payable: **₹{raw_res['total_interest']:,.0f}**\n"
            f"- Total Repayment Amount: **₹{raw_res['total_payment']:,.0f}**\n\n"
            f"Review the full principal vs. interest breakdown and year-by-year amortization schedule below:"
        )

    elif classification.intent == "investment":
        amt = classification.entities.amount or 10000.0
        r = classification.entities.rate or 12.0
        t = classification.entities.tenure or 10.0
        raw_res, comp, f_str, assump = execute_tool("calculate_sip", {"monthly_investment": amt, "annual_rate": r, "tenure_years": t}, lang)
        components.append(BotComponent(**comp))
        formula = f_str
        assumptions = assump
        chips = ["What if returns are 15% CAGR?", f"Increase SIP to ₹{amt*1.5:,.0f}", "Taxation on SIP vs FD"] if not is_hi else ["यदि 15% रिटर्न मिले?", f"मासिक SIP ₹{amt*1.5:,.0f} करें", "SIP बनाम FD टैक्स नियम"]
        text = (
            f"**₹{amt:,.0f}/माह** का **{t:g}-वर्षीय SIP** (@ {r}% अनुमानित CAGR) से लगभग **₹{raw_res['result']:,.0f}** की संपदा संचित होती है।\n\n"
            f"- कुल निवेश: ₹{raw_res['invested']:,.0f}\n"
            f"- अर्जित संपदा लाभ: ₹{raw_res['gain']:,.0f}\n\n"
            f"नीचे दी गई तुलना तालिका व वेल्थ ग्रोथ चार्ट में देखें कि कैसे SIP चक्रवृद्धि ब्याज बैंक FD से काफी अधिक संपदा बनाती है:"
            if is_hi else
            f"A disciplined monthly SIP of **₹{amt:,.0f}** for **{t:g} years** at an assumed **{r}% CAGR** compounds to an estimated **₹{raw_res['result']:,.0f}**.\n\n"
            f"- Invested Capital: ₹{raw_res['invested']:,.0f}\n"
            f"- Estimated Wealth Gain: ₹{raw_res['gain']:,.0f}\n\n"
            f"Review the side-by-side SIP vs. Bank FD comparison table and trajectory chart below:"
        )

    elif classification.intent == "savings":
        target = classification.entities.amount or 500000.0
        current = (target * 0.4)
        deposit = 25000.0
        raw_res, comp, f_str, assump = execute_tool("calculate_goal_timeline", {"target_amount": target, "current_amount": current, "monthly_deposit": deposit}, lang)
        components.append(BotComponent(**comp))
        formula = f_str
        assumptions = assump
        chips = ["Best liquid mutual funds", "Increase savings by ₹10,000", "Emergency fund rules"] if not is_hi else ["सर्वोत्तम लिक्विड फंड", "मासिक बचत ₹10,000 बढ़ाएं", "आपात स्थिति नियम"]
        text = (
            f"**₹{target:,.0f}** के बचत लक्ष्य (आपातकालीन फंड) हेतु वर्तमान में संचित राशि ₹{current:,.0f} है।\n\n"
            f"₹{deposit:,.0f}/माह की बचत दर से आप **{raw_res['months']} महीनों** में लक्ष्य प्राप्त कर लेंगे।"
            if is_hi else
            f"For your target savings goal of **₹{target:,.0f}**, with an estimated current balance of ₹{current:,.0f} and savings of ₹{deposit:,.0f}/mo, you will achieve 100% funding in **{raw_res['months']} months**."
        )

    elif classification.intent == "debt":
        debt_amt = classification.entities.amount or 300000.0
        rate = classification.entities.rate or 24.0
        raw_res, comp, f_str, assump = execute_tool(
            "calculate_debt_payoff",
            {"debts": [{"name": "High Interest Debt", "balance": debt_amt, "rate": rate, "min_payment": debt_amt * 0.03}], "extra_monthly": 10000},
            lang
        )
        components.append(BotComponent(**comp))
        formula = f_str
        assumptions = assump
        chips = ["Snowball vs Avalanche", "Consolidate to a personal loan", "How to avoid debt traps"] if not is_hi else ["स्नोबॉल बनाम एवलांच", "पर्सनल लोन में समेकन", "कर्ज जाल से कैसे बचें"]
        text = (
            f"**₹{debt_amt:,.0f}** के उच्च ब्याज ऋण ({rate}% दर) को **एवलांच विधि** द्वारा अतिरिक्त ₹10,000/माह देकर मात्र **{raw_res['avalanche']['months_to_debt_free']} महीनों** में पूरी तरह समाप्त किया जा सकता है।"
            if is_hi else
            f"Using the mathematically optimal **Debt Avalanche strategy** on your **₹{debt_amt:,.0f}** debt at {rate}% with an extra ₹10,000/month, you will be completely debt-free in **{raw_res['avalanche']['months_to_debt_free']} months**."
        )

    else:
        # Planning / Risk Profiling default
        raw_res, comp, f_str, assump = execute_tool("calculate_risk_score", {"answers": [3, 3, 3, 3]}, lang)
        components.append(BotComponent(**comp))
        formula = f_str
        assumptions = assump
        chips = ["Plan my monthly budget", "Calculate loan EMI", "SIP vs FD comparison", "Assess my investment risk"] if not is_hi else ["मासिक 50/30/20 बजट बनाएं", "लोन ईएमआई निकालें", "SIP बनाम FD तुलना", "जोखिम प्रोफाइल"]
        text = (
            "नमस्ते! मैं FinBot हूँ—भारतीय उपयोगकर्ताओं के लिए आपका वित्तीय सहायक। मैं बजट, लोन ईएमआई, बचत और SIP निवेश में आपकी सहायता कर सकता हूँ।"
            if is_hi else
            "Hello! I'm FinBot—your educational financial assistant for Indian investors. I provide interactive tools for budgeting, EMI calculations, and SIP compounding."
        )

    return BotResponse(
        text=text,
        components=components,
        chips=chips,
        assumptions=assumptions,
        formula=formula,
        intent=classification.intent,
        language=lang,
        glossary=glossary_items
    )


async def call_claude_with_tools(
    message: str,
    history: Optional[List[Dict[str, str]]] = None,
    locale: str = "en"
) -> BotResponse:
    """
    Executes conversation with Claude API using Intent Classification, Entity Extraction,
    and Tool Calling.
    """
    # 1. Classify intent and extract entities (with Claude or deterministic fallback)
    classification = await classify_with_llm(message, history, preferred_locale=locale)
    lang = classification.language or locale

    # If missing entities or out-of-scope, return structured response immediately without guessing
    if classification.intent == "out-of-scope" or classification.missing_entities:
        return generate_response_from_intent(message, classification, locale=lang)

    # If Claude API key is not present, use deterministic execution with the extracted entities
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return generate_response_from_intent(message, classification, locale=lang)

    try:
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=api_key)

        # Build message history for Claude
        messages: List[Dict[str, Any]] = []
        if history:
            for item in history:
                messages.append({"role": item.get("role", "user"), "content": item.get("content", "")})
        messages.append({"role": "user", "content": message})

        # Call Claude with tools exposed
        response = await client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=(
                f"{SYSTEM_PROMPT}\n"
                f"The user query has been classified as intent: '{classification.intent}' in language '{lang}'.\n"
                f"Extracted entities: {classification.entities.model_dump()}.\n"
                f"Always answer in {'Hindi (Devanagari with technical terms in parentheses)' if lang == 'hi' else 'English'}."
            ),
            tools=CLAUDE_TOOLS,
            messages=messages
        )

        components: List[BotComponent] = []
        assumptions: List[str] = []
        formula: Optional[str] = None
        final_text = ""

        tool_calls = [c for c in response.content if c.type == "tool_use"]

        if tool_calls:
            tool_results_content = []
            for tool_call in tool_calls:
                raw_result, comp, f_str, assump = execute_tool(tool_call.name, tool_call.input, lang)
                if comp:
                    components.append(BotComponent(**comp))
                if f_str and not formula:
                    formula = f_str
                if assump:
                    assumptions.extend(assump)

                tool_results_content.append({
                    "type": "tool_result",
                    "tool_use_id": tool_call.id,
                    "content": json.dumps(raw_result)
                })

            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results_content})

            second_response = await client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                messages=messages
            )

            text_blocks = [c.text for c in second_response.content if c.type == "text"]
            final_text = "\n\n".join(text_blocks)
        else:
            text_blocks = [c.text for c in response.content if c.type == "text"]
            final_text = "\n\n".join(text_blocks)

        glossary_items = get_glossary_items(classification.terms_to_define, locale=lang)
        chips = [
            "Plan my 50/30/20 budget", "Calculate loan EMI", "SIP vs FD comparison", "Assess investment risk"
        ] if lang != "hi" else [
            "मासिक 50/30/20 बजट बनाएं", "लोन ईएमआई निकालें", "SIP बनाम FD तुलना", "जोखिम प्रोफाइल जांचें"
        ]

        return BotResponse(
            text=final_text,
            components=components,
            chips=chips,
            assumptions=assumptions,
            formula=formula,
            intent=classification.intent,
            language=lang,
            glossary=glossary_items
        )

    except Exception as e:
        print(f"[FinBot API] Claude invocation error, using deterministic: {e}")
        return generate_response_from_intent(message, classification, locale=lang)


@app.post("/chat", response_model=BotResponse)
@app.post("/api/chat", response_model=BotResponse)
async def chat_endpoint(request: ChatRequest, req: Request):
    """
    POST /chat endpoint.
    Supports standard JSON response or Server-Sent Events (SSE) streaming.
    """
    history_dicts = [{"role": h.role, "content": h.content} for h in (request.history or [])]
    locale = request.locale or "en"

    # Streaming mode requested
    if request.stream or "text/event-stream" in req.headers.get("accept", ""):
        async def event_generator() -> AsyncGenerator[str, None]:
            bot_response = await call_claude_with_tools(request.message, history_dicts, locale)

            # Progressive token streaming
            words = bot_response.text.split(" ")
            for i, word in enumerate(words):
                token = word if i == len(words) - 1 else word + " "
                chunk = json.dumps({"type": "token", "content": token})
                yield chunk
                await asyncio.sleep(0.012)

            # Send complete response with components, formula, assumptions, chips, and glossary
            done_chunk = json.dumps({
                "type": "done",
                "response": bot_response.model_dump()
            })
            yield done_chunk
            yield "[DONE]"

        return EventSourceResponse(event_generator())

    # Standard JSON mode
    bot_response = await call_claude_with_tools(request.message, history_dicts, locale)
    return bot_response
