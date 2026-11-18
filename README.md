# 🤖 FinBot - AI Personal Finance Assistant for Indian Users 🇮🇳

FinBot is a modern, full-stack AI financial copilot designed specifically for Indian personal finance scenarios. It features real-time deterministic mathematical calculations, Claude 3.5 Sonnet tool-calling with Server-Sent Events (SSE) streaming, bilingual English and Hindi natural language processing with an educational glossary, interactive rich financial components, and real-time dashboard synchronization.

---

## 🌟 Live Deployment

- **Production URL**: [https://finbot-finance-chatbot.vercel.app](https://finbot-finance-chatbot.vercel.app)
- **Deployment Platform**: Vercel (Vite SPA Frontend + Python ASGI Serverless API)

---

## ✨ Feature Matrix

| Category | Feature | Status |
| :--- | :--- | :---: |
| **Layout & UX** | Left sidebar (new chat, topic shortcuts, chat history, pinned chats) | ✅ |
| | Center chat conversation area with autoscrolling & message actions | ✅ |
| | Collapsible Right Live Dashboard with real-time entity synchronization | ✅ |
| | Mobile-responsive design (Slide-out navigation drawer & Bottom Sheet dashboard) | ✅ |
| **Onboarding** | Welcome screen with 6 starter prompt cards (Budget, Loan, Savings, SIP vs FD, Risk, Debt) | ✅ |
| **Core Chat & LLM** | Secure server-side route (FastAPI backend; API keys never exposed to client) | ✅ |
| | Claude 3.5 Sonnet tool-calling with deterministic financial calculator tools | ✅ |
| | Server-Sent Events (SSE) token streaming with typing indicator & smooth word delivery | ✅ |
| | Zero-guesswork Intent Classifier (7 intents: `budget`, `loan`, `savings`, `investment`, `planning`, `debt`, `out-of-scope`) | ✅ |
| | Missing entity detection returning interactive `<InlineForm />` instead of guessing | ✅ |
| **Rich Components** | Interactive Budget Donut chart with category sliders & 50/30/20 breakdown | ✅ |
| | Loan EMI Calculator with interactive tenure/interest sliders & yearly Amortization table | ✅ |
| | Savings Goal Progress card with milestone timeline & monthly runway | ✅ |
| | SIP vs Fixed Deposit 10-Year Compounding Comparison Table & Line Chart | ✅ |
| | 3-Zone Risk Gauge (Conservative, Moderate, Aggressive) with asset allocation breakdown | ✅ |
| | Suggested Quick-Reply Chips for guided exploration | ✅ |
| | Standalone interactive Storybook Component Showcase (`/storybook` view) | ✅ |
| **Trust & Safety** | Prominent SEBI educational disclaimer across chat, forms, and exports | ✅ |
| | `"Why this answer?"` expander explaining formulas, assumptions, and logic | ✅ |
| | Thumbs up / Thumbs down message feedback with instant reaction state | ✅ |
| | Interactive hover/tap Jargon Tooltips for terms like `EMI`, `SIP`, `FD`, `CAGR`, `50/30/20` | ✅ |
| | Web Speech API audio read-aloud playback for accessibility | ✅ |
| **Extras & Persistence** | Instant English / Hindi (हिन्दी 🇮🇳) language toggle with bilingual glossary | ✅ |
| | Dark Mode & Light Mode support with smooth theme persistence | ✅ |
| | Export Financial Plan & Chat Transcript as formatted PDF (`window.print`) and CSV | ✅ |
| | Indian Number Formatting throughout (`₹1,00,000`, `₹25,00,000`) | ✅ |
| | Complete client-side state persistence in `localStorage` across page reloads | ✅ |

---

## 📐 Mathematical Formulas Implemented

All calculations run deterministically via pure mathematical functions (`src/lib/financialMath.ts` and `backend/financial_math.py`):

1. **Loan EMI**:
   $$\text{EMI} = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}$$
2. **Stacked Amortization Schedule**:
   $$\text{Interest}_t = \text{Balance}_{t-1} \cdot r, \quad \text{Principal}_t = \text{EMI} - \text{Interest}_t$$
3. **SIP Future Value**:
   $$\text{FV} = P \cdot \frac{(1 + i)^n - 1}{i} \cdot (1 + i)$$
4. **FD Maturity (Quarterly Compounding)**:
   $$A = P \cdot \left(1 + \frac{r}{4}\right)^{4t}$$
5. **CAGR (Compound Annual Growth Rate)**:
   $$\text{CAGR} = \left(\frac{\text{Ending Value}}{\text{Beginning Value}}\right)^{\frac{1}{t}} - 1$$
6. **50/30/20 Budget Allocation**:
   $$\text{Needs} = 50\%, \quad \text{Wants} = 30\%, \quad \text{Savings} = 20\%$$
7. **Savings Emergency Runway**:
   $$\text{Runway (Months)} = \frac{\text{Current Savings}}{\text{Monthly Essential Expenses}}$$
8. **Debt Payoff (Avalanche Priority)**:
   Cascades surplus payments in descending order of APR ($\max(\text{APR})$).
9. **Risk Tolerance Score**:
   Normalized 0–100 weighted index categorizing into Conservative, Moderate, or Aggressive tiers.

---

## 🛠️ Project Structure

```
├── api/
│   └── index.py               # Vercel ASGI serverless handler
├── backend/
│   ├── main.py                # FastAPI server with /chat & /api/chat endpoints
│   ├── classifier.py          # Intent classification & entity extraction
│   ├── tools.py               # Claude API tool-calling definitions & execution
│   ├── financial_math.py      # Python financial math library
│   ├── glossary.py            # Bilingual Indian financial glossary
│   ├── schemas.py             # Pydantic request/response models
│   └── test_suite.py          # Python backend test suite (7 tests)
├── src/
│   ├── components/
│   │   ├── chat/              # ChatArea, MessageBubble, ComponentRenderer, ChatInput, WelcomeScreen
│   │   ├── reusable/          # BudgetDonut, EmiCalculatorCard, SavingsGoalProgress, RiskGauge, InlineForm
│   │   ├── dashboard/         # LiveDashboard, InteractiveScenarioSimulator
│   │   ├── sidebar/           # Sidebar, ChatHistoryItem, TopicShortcuts
│   │   ├── mobile/            # MobileDrawer, MobileBottomSheet
│   │   └── storybook/         # StorybookDemo component playground
│   ├── context/
│   │   └── FinancialContext.tsx # Global state, localStorage persistence, LiveDashboard sync
│   ├── lib/
│   │   ├── chatService.ts     # Client-to-FastAPI SSE streaming & mock fallback
│   │   ├── classifier.ts      # Client-side intent classifier & entity extractor
│   │   ├── financialMath.ts   # Pure TypeScript math library
│   │   ├── glossary.ts        # Bilingual dictionary & trigger detector
│   │   ├── exportUtils.ts     # PDF and CSV export utilities
│   │   └── utils.ts           # Indian currency formatting (₹)
│   └── types/
│       └── finance.ts         # TypeScript interfaces & component schema
├── vercel.json                # Vercel routing & Serverless Function rewrites
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.10 (tested on Python 3.11–3.14)
- **Anthropic API Key** (optional: app automatically uses client-side engine if API key is not configured)

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/finbot-finance-chatbot.git
   cd finbot-finance-chatbot
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install Python backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Add your Anthropic API key to `.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

---

### Running Locally

You can run both the frontend and backend in parallel:

1. **Start the FastAPI Backend**:
   ```bash
   python backend/run.py
   # Or: uvicorn backend.main:app --reload --port 8000
   ```
   The backend API will be running on `http://127.0.0.1:8000`. You can inspect the interactive OpenAPI documentation at `http://127.0.0.1:8000/docs`.

2. **Start the Vite Frontend**:
   ```bash
   npm run dev
   ```
   The web application will open on `http://localhost:3000`. Vite proxies `/api/*` requests directly to `http://127.0.0.1:8000`.

---

## 🧪 Testing

### Frontend & Math Unit Tests (Node.js test runner)
Run the 17 unit tests verifying TypeScript financial formulas and intent classification:
```bash
npm test
```

### Python Backend Test Suite
Run the 7 backend integration tests verifying entity extraction, language detection, and Claude tools:
```bash
python backend/test_suite.py
```

### Production Build & Type Check
Verify clean compilation with zero TypeScript errors:
```bash
npm run build
```

---

## 🚢 Deploying to Vercel

The application is fully pre-configured for one-command deployment to Vercel with Python Serverless Function support:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Link and Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables on Vercel**:
   Go to **Project Settings > Environment Variables** and add:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key.

4. **Production Deployment**:
   ```bash
   vercel --prod
   ```

---

## 🔒 Security & Privacy

- **Zero Client-Side Secrets**: `ANTHROPIC_API_KEY` is strictly accessed within Python serverless routes and never transmitted to client bundles.
- **Client-Side Persistence**: Chat histories and user preferences remain in your browser's `localStorage` and are not stored in any external database.
- **SEBI Compliance Notice**: FinBot is an educational technology demonstration. It does not provide registered investment advisory services under SEBI (Investment Advisers) Regulations, 2013.

---

## 📄 License

MIT License. Designed and developed with ❤️ for Indian personal finance awareness.
