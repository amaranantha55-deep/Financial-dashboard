"""
Pure Python Financial Mathematics Module for FinBot Backend.
Calculates core financial formulas and returns both the numerical result 
and the LaTeX/text formula string for the "Why this answer?" panel.
"""

from typing import Dict, List, Any, Optional
import math


def emi(p: float, annual_rate: float, years: float) -> Dict[str, Any]:
    """Calculate Equated Monthly Installment (EMI)."""
    if p <= 0 or years <= 0:
        return {
            "result": 0,
            "formula": "EMI = 0",
            "explanation": "Principal and years must be positive."
        }

    n = round(years * 12)
    r = (annual_rate / 12.0) / 100.0

    if r == 0:
        emi_val = p / n
    else:
        compound = math.pow(1.0 + r, n)
        emi_val = (p * r * compound) / (compound - 1.0)

    result = round(emi_val)
    total_payment = result * n
    total_interest = max(0, total_payment - p)

    return {
        "result": result,
        "exact_emi": emi_val,
        "principal": p,
        "annual_rate": annual_rate,
        "tenure_years": years,
        "total_months": n,
        "total_interest": total_interest,
        "total_payment": total_payment,
        "formula": "EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]",
        "explanation": f"Principal ₹{p:,.0f} at {annual_rate}% over {n} months yields EMI of ₹{result:,.0f}/month."
    }


def amortization_schedule(p: float, annual_rate: float, years: int) -> Dict[str, Any]:
    """Generate annual amortization schedule."""
    emi_info = emi(p, annual_rate, years)
    monthly_rate = (annual_rate / 12.0) / 100.0
    schedule = []
    current_balance = float(p)
    total_interest = 0.0
    total_principal = 0.0

    for year in range(1, int(years) + 1):
        opening = round(current_balance)
        yr_interest = 0.0
        yr_principal = 0.0

        for _ in range(12):
            if current_balance <= 0:
                break
            interest_month = current_balance * monthly_rate
            principal_month = min(current_balance, emi_info["result"] - interest_month)
            yr_interest += interest_month
            yr_principal += principal_month
            current_balance = max(0.0, current_balance - principal_month)

        total_interest += yr_interest
        total_principal += yr_principal

        schedule.append({
            "period": year,
            "opening_balance": opening,
            "emi": emi_info["result"] * 12,
            "principal_paid": round(yr_principal),
            "interest_paid": round(yr_interest),
            "closing_balance": round(current_balance)
        })

    return {
        "schedule": schedule,
        "total_principal": round(total_principal),
        "total_interest": round(total_interest),
        "total_payment": round(total_principal + total_interest),
        "formula": "Yearly Principal Paid = Sum(Monthly EMI - Monthly Interest)",
        "explanation": f"Amortization schedule tracks declining principal balance over {years} years."
    }


def sip_future_value(monthly_investment: float, annual_rate: float, years: float) -> Dict[str, Any]:
    """Calculate SIP future maturity corpus."""
    n = round(years * 12)
    i = (annual_rate / 12.0) / 100.0
    total_invested = monthly_investment * n

    if i == 0:
        fv = total_invested
    else:
        fv = monthly_investment * ((math.pow(1.0 + i, n) - 1.0) / i) * (1.0 + i)

    result = round(fv)
    gain = result - total_invested

    return {
        "result": result,
        "total_invested": round(total_invested),
        "wealth_gain": round(gain),
        "formula": "FV = P × [((1 + i)^n - 1) / i] × (1 + i)",
        "explanation": f"₹{monthly_investment:,.0f}/mo for {years} years at {annual_rate}% CAGR compounds to ₹{result:,.0f} (+₹{gain:,.0f} gain)."
    }


def fd_maturity(principal: float, annual_rate: float, years: float) -> Dict[str, Any]:
    """Fixed Deposit (FD) maturity with quarterly compounding."""
    quarters = round(years * 4)
    quarterly_rate = (annual_rate / 4.0) / 100.0
    maturity = principal * math.pow(1.0 + quarterly_rate, quarters)
    result = round(maturity)
    interest = result - round(principal)

    return {
        "result": result,
        "principal": round(principal),
        "total_interest": interest,
        "compounding": "quarterly",
        "quarters": quarters,
        "formula": "A = P × (1 + r / 400)^(4 × t)",
        "explanation": f"₹{principal:,.0f} at {annual_rate}% compounded quarterly over {years} years yields ₹{result:,.0f}."
    }


def cagr(beginning_val: float, ending_val: float, years: float) -> Dict[str, Any]:
    """Calculate Compound Annual Growth Rate (CAGR)."""
    decimal_val = math.pow(ending_val / beginning_val, 1.0 / years) - 1.0
    percentage = round(decimal_val * 10000.0) / 100.0

    return {
        "result": decimal_val,
        "percentage": percentage,
        "formula": "CAGR = (Ending Value / Beginning Value)^(1 / years) - 1",
        "explanation": f"Growth from ₹{beginning_val:,.0f} to ₹{ending_val:,.0f} in {years} years equates to an annualized CAGR of {percentage}%."
    }


def budget503020(monthly_income: float) -> Dict[str, Any]:
    """50/30/20 Budgeting framework."""
    income = max(0.0, monthly_income)
    needs = round(income * 0.50)
    wants = round(income * 0.30)
    savings = round(income * 0.20)

    return {
        "monthly_income": income,
        "needs": needs,
        "wants": wants,
        "savings": savings,
        "formula": "Needs = Income × 0.50 | Wants = Income × 0.30 | Savings = Income × 0.20",
        "explanation": f"Income of ₹{income:,.0f} split into ₹{needs:,.0f} Needs (50%), ₹{wants:,.0f} Wants (30%), and ₹{savings:,.0f} Savings (20%)."
    }


def goal_timeline(target_amount: float, current_amount: float, monthly_deposit: float) -> Dict[str, Any]:
    """Months and years needed to achieve a savings goal."""
    remaining = max(0.0, target_amount - current_amount)
    if remaining == 0:
        months = 0
    elif monthly_deposit <= 0:
        months = float("inf")
    else:
        months = math.ceil(remaining / monthly_deposit)

    years = round((months / 12.0) * 10.0) / 10.0

    return {
        "months": months,
        "years": years,
        "remaining_amount": round(remaining),
        "formula": "Months = ⌈(Target Amount - Current Amount) / Monthly Contribution⌉",
        "explanation": f"Bridging the remaining ₹{remaining:,.0f} at ₹{monthly_deposit:,.0f}/mo requires {months} months ({years} years)."
    }


def debt_payoff_avalanche(debts: List[Dict[str, Any]], extra_monthly_payment: float = 0.0) -> Dict[str, Any]:
    """Debt Avalanche strategy: orders debts by highest APR first."""
    sorted_debts = sorted(debts, key=lambda d: d.get("interest_rate", 0), reverse=True)
    payoff_order = [d.get("name", "Account") for d in sorted_debts]

    return {
        "payoff_order": payoff_order,
        "formula": "Avalanche Priority: Target max(APR) debt with all extra cash while maintaining minimums",
        "explanation": f"Targeting {payoff_order[0] if payoff_order else 'Priority Debt'} first minimizes total interest paid."
    }


def risk_score(answers: List[int]) -> Dict[str, Any]:
    """Calculate 0 to 100 risk score and categorize into Low, Moderate, or High."""
    if not answers:
        score = 50
    else:
        avg = sum(answers) / len(answers)
        score = round(((avg - 1.0) / 4.0) * 100.0)

    if score < 35:
        category = "low"
        allocation = {"equity": 20, "debt": 75, "gold": 5}
    elif score > 65:
        category = "high"
        allocation = {"equity": 85, "debt": 10, "gold": 5}
    else:
        category = "moderate"
        allocation = {"equity": 60, "debt": 30, "gold": 10}

    return {
        "score": score,
        "category": category,
        "recommended_allocation": allocation,
        "formula": "Score = [(Average Answer - 1) / 4] × 100",
        "explanation": f"Score {score}/100 maps to {category.capitalize()} tier. Recommended allocation: {allocation['equity']}% Equities, {allocation['debt']}% Debt, {allocation['gold']}% Gold."
    }

