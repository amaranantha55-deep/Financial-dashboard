"""
Claude API Tool Definitions and Dispatcher for FinBot.
Exposes financial calculation tools to Claude and generates corresponding UI component payloads.
"""

from typing import Dict, Any, Tuple, Optional, List
from . import financial_math

# 1. Anthropic Tool Schema Declarations
CLAUDE_TOOLS = [
    {
        "name": "calculate_emi",
        "description": "Calculates loan EMI (Equated Monthly Installment), total interest, and total repayment amount using the standard reducing balance formula.",
        "input_schema": {
            "type": "object",
            "properties": {
                "principal": {
                    "type": "number",
                    "description": "Total loan principal amount in INR (e.g. 1000000 for ₹10 Lakhs)"
                },
                "annual_rate": {
                    "type": "number",
                    "description": "Annual interest rate percentage (e.g. 8.5 for 8.5% p.a.)"
                },
                "tenure_years": {
                    "type": "number",
                    "description": "Loan tenure in years (e.g. 5 for a 5-year loan)"
                }
            },
            "required": ["principal", "annual_rate", "tenure_years"]
        }
    },
    {
        "name": "calculate_amortization",
        "description": "Generates a full year-by-year loan amortization schedule showing principal paid, interest paid, and remaining balance.",
        "input_schema": {
            "type": "object",
            "properties": {
                "principal": {
                    "type": "number",
                    "description": "Loan principal amount in INR"
                },
                "annual_rate": {
                    "type": "number",
                    "description": "Annual interest rate percentage"
                },
                "tenure_years": {
                    "type": "integer",
                    "description": "Loan duration in years"
                }
            },
            "required": ["principal", "annual_rate", "tenure_years"]
        }
    },
    {
        "name": "calculate_sip",
        "description": "Calculates the future maturity corpus and wealth gain of a monthly Systematic Investment Plan (SIP) in mutual funds.",
        "input_schema": {
            "type": "object",
            "properties": {
                "monthly_investment": {
                    "type": "number",
                    "description": "Monthly SIP installment in INR (e.g. 10000)"
                },
                "annual_rate": {
                    "type": "number",
                    "description": "Expected annual compounded return / CAGR percentage (e.g. 12.0 for 12%)"
                },
                "tenure_years": {
                    "type": "number",
                    "description": "Investment time horizon in years (e.g. 10)"
                }
            },
            "required": ["monthly_investment", "annual_rate", "tenure_years"]
        }
    },
    {
        "name": "calculate_fd",
        "description": "Calculates Bank Fixed Deposit (FD) maturity value with standard quarterly compounding.",
        "input_schema": {
            "type": "object",
            "properties": {
                "principal": {
                    "type": "number",
                    "description": "Lump sum FD deposit amount in INR"
                },
                "annual_rate": {
                    "type": "number",
                    "description": "Annual interest rate percentage (e.g. 7.0 for 7%)"
                },
                "tenure_years": {
                    "type": "number",
                    "description": "Deposit tenure in years"
                }
            },
            "required": ["principal", "annual_rate", "tenure_years"]
        }
    },
    {
        "name": "calculate_cagr",
        "description": "Calculates the Compound Annual Growth Rate (CAGR) between beginning and ending asset values.",
        "input_schema": {
            "type": "object",
            "properties": {
                "beginning_value": {
                    "type": "number",
                    "description": "Initial investment value in INR"
                },
                "ending_value": {
                    "type": "number",
                    "description": "Final matured value in INR"
                },
                "tenure_years": {
                    "type": "number",
                    "description": "Holding period in years"
                }
            },
            "required": ["beginning_value", "ending_value", "tenure_years"]
        }
    },
    {
        "name": "calculate_budget_503020",
        "description": "Allocates monthly net income into the 50/30/20 framework: 50% Needs, 30% Wants, and 20% Savings.",
        "input_schema": {
            "type": "object",
            "properties": {
                "monthly_income": {
                    "type": "number",
                    "description": "Monthly net take-home income in INR (e.g. 100000)"
                }
            },
            "required": ["monthly_income"]
        }
    },
    {
        "name": "calculate_goal_timeline",
        "description": "Calculates the months and years required to achieve a savings or emergency fund goal.",
        "input_schema": {
            "type": "object",
            "properties": {
                "target_amount": {
                    "type": "number",
                    "description": "Target financial goal amount in INR"
                },
                "current_amount": {
                    "type": "number",
                    "description": "Current savings already accumulated in INR"
                },
                "monthly_deposit": {
                    "type": "number",
                    "description": "Monthly savings contribution in INR"
                }
            },
            "required": ["target_amount", "current_amount", "monthly_deposit"]
        }
    },
    {
        "name": "calculate_debt_avalanche",
        "description": "Evaluates the Debt Avalanche strategy by targeting highest APR liabilities first.",
        "input_schema": {
            "type": "object",
            "properties": {
                "debts": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "name": { "type": "string" },
                            "balance": { "type": "number" },
                            "interest_rate": { "type": "number" },
                            "min_payment": { "type": "number" }
                        },
                        "required": ["name", "balance", "interest_rate", "min_payment"]
                    },
                    "description": "List of active debt accounts"
                },
                "extra_monthly_payment": {
                    "type": "number",
                    "description": "Extra disposable cash allocated for monthly debt reduction in INR"
                }
            },
            "required": ["debts"]
        }
    },
    {
        "name": "calculate_risk_score",
        "description": "Evaluates an investor's volatility tolerance and returns risk score (0-100) and recommended asset allocation.",
        "input_schema": {
            "type": "object",
            "properties": {
                "answers": {
                    "type": "array",
                    "items": { "type": "integer", "minimum": 1, "maximum": 5 },
                    "description": "List of numeric risk answers (values 1 to 5)"
                }
            },
            "required": ["answers"]
        }
    }
]


# 2. Tool Dispatcher & UI Component Payload Mapper
def execute_tool(name: str, args: Dict[str, Any], locale: str = "en") -> Tuple[Dict[str, Any], Optional[Dict[str, Any]], Optional[str], List[str]]:
    """
    Executes a financial math tool and returns:
    - raw_result: dict returned to Claude
    - component_payload: dict describing React component ({ 'type': ..., 'props': ... })
    - formula: mathematical formula string
    - assumptions: list of assumptions
    """
    raw_result = {}
    component = None
    formula = None
    assumptions = []

    if name in ("calculate_emi", "calculate_amortization"):
        p = float(args.get("principal", 1000000))
        rate = float(args.get("annual_rate", 8.5))
        years = float(args.get("tenure_years", 5))

        emi_res = financial_math.emi(p, rate, years)
        raw_result = emi_res
        formula = emi_res["formula"]
        assumptions = [
            f"Loan Principal: ₹{p:,.0f}",
            f"Interest Rate: {rate}% p.a. on reducing balance",
            f"Tenure: {years:g} Years ({int(years * 12)} monthly installments)"
        ]
        component = {
            "type": "EmiCalculatorCard",
            "props": {
                "initialPrincipal": p,
                "initialRate": rate,
                "initialTenureYears": years,
                "showAmortizationChart": True,
                "locale": locale
            }
        }

    elif name == "calculate_sip":
        monthly = float(args.get("monthly_investment", 10000))
        rate = float(args.get("annual_rate", 12.0))
        years = float(args.get("tenure_years", 10))

        sip_res = financial_math.sip_future_value(monthly, rate, years)
        raw_result = sip_res
        formula = sip_res["formula"]
        assumptions = [
            f"Monthly Investment: ₹{monthly:,.0f}",
            f"Expected Returns: {rate}% CAGR",
            f"Investment Period: {years:g} Years ({int(years * 12)} contributions)",
            "Long-term inflation benchmark: 5.5% p.a."
        ]
        component = {
            "type": "GrowthLineChart",
            "props": {
                "monthlyAmount": monthly,
                "tenureYears": years,
                "sipCagr": rate,
                "fdApy": 6.8,
                "showInvestedLine": True,
                "locale": locale
            }
        }

    elif name == "calculate_fd":
        p = float(args.get("principal", 100000))
        rate = float(args.get("annual_rate", 7.0))
        years = float(args.get("tenure_years", 5))

        fd_res = financial_math.fd_maturity(p, rate, years)
        raw_result = fd_res
        formula = fd_res["formula"]
        assumptions = [
            f"Deposit Principal: ₹{p:,.0f}",
            f"Annual Interest Rate: {rate}%",
            f"Compounding: Quarterly (4 times a year)",
            f"Tenure: {years:g} Years"
        ]
        component = {
            "type": "ComparisonTable",
            "props": {
                "monthlyAmount": 10000,
                "tenureYears": years,
                "sipCagr": 12.5,
                "fdApy": rate,
                "locale": locale
            }
        }

    elif name == "calculate_cagr":
        start_val = float(args.get("beginning_value", 100000))
        end_val = float(args.get("ending_value", 200000))
        years = float(args.get("tenure_years", 5))

        cagr_res = financial_math.cagr(start_val, end_val, years)
        raw_result = cagr_res
        formula = cagr_res["formula"]
        assumptions = [
            f"Beginning Capital: ₹{start_val:,.0f}",
            f"Matured Capital: ₹{end_val:,.0f}",
            f"Holding Duration: {years:g} Years"
        ]

    elif name == "calculate_budget_503020":
        income = float(args.get("monthly_income", 100000))
        b_res = financial_math.budget503020(income)
        raw_result = b_res
        formula = b_res["formula"]
        assumptions = [
            f"Net Monthly Income: ₹{income:,.0f}",
            f"50% Essential Needs: ₹{b_res['needs']:,.0f}",
            f"30% Discretionary Wants: ₹{b_res['wants']:,.0f}",
            f"20% Savings & Investments: ₹{b_res['savings']:,.0f}"
        ]
        component = {
            "type": "BudgetDonut",
            "props": {
                "monthlyIncome": income,
                "initialNeeds": 50,
                "initialWants": 30,
                "initialSavings": 20,
                "locale": locale,
                "showControls": True
            }
        }

    elif name == "calculate_goal_timeline":
        target = float(args.get("target_amount", 500000))
        current = float(args.get("current_amount", 200000))
        deposit = float(args.get("monthly_deposit", 25000))

        gt_res = financial_math.goal_timeline(target, current, deposit)
        raw_result = gt_res
        formula = gt_res["formula"]
        assumptions = [
            f"Target Reserve: ₹{target:,.0f}",
            f"Current Balance: ₹{current:,.0f}",
            f"Monthly Contribution: ₹{deposit:,.0f}/mo"
        ]
        component = {
            "type": "SavingsGoalProgress",
            "props": {
                "targetAmount": target,
                "currentAmount": current,
                "monthlyDeposit": deposit,
                "locale": locale
            }
        }

    elif name == "calculate_debt_avalanche":
        debts = args.get("debts", [])
        extra = float(args.get("extra_monthly_payment", 0))

        debt_res = financial_math.debt_payoff_avalanche(debts, extra)
        raw_result = debt_res
        formula = debt_res["formula"]
        assumptions = [
            "Avalanche strategy: Prioritize debts with highest annual percentage rate (APR)",
            f"Extra Monthly Payment: ₹{extra:,.0f}/mo",
            "Pay minimum balances on all non-priority accounts"
        ]

    elif name == "calculate_risk_score":
        answers = args.get("answers", [3, 3, 3, 3])
        r_res = financial_math.risk_score(answers)
        raw_result = r_res
        formula = r_res["formula"]
        assumptions = [
            f"Evaluated Risk Score: {r_res['score']}/100 ({r_res['category'].capitalize()})",
            f"Target Asset Mix: {r_res['recommended_allocation']['equity']}% Equity, {r_res['recommended_allocation']['debt']}% Debt, {r_res['recommended_allocation']['gold']}% Gold"
        ]
        component = {
            "type": "RiskGauge",
            "props": {
                "value": r_res["category"],
                "score": r_res["score"],
                "locale": locale,
                "interactive": True
            }
        }

    return raw_result, component, formula, assumptions

