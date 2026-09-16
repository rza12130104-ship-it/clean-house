# Debt Modeling — Detailed Reference

## Payoff Strategies

### Avalanche Method (default)
Pay minimums on all debts, direct extra payment to the debt with the **highest interest rate**. Minimizes total interest paid.

### Snowball Method
Pay minimums on all debts, direct extra payment to the debt with the **lowest balance**. Provides psychological wins through quick payoffs.

### Comparison
Always calculate both and show the interest difference. The avalanche method is mathematically optimal; the snowball method may succeed behaviorally.

## Amortization Formula

Monthly payment for a loan to be paid off in `n` months:

```
PMT = P * r * (1 + r)^n / ((1 + r)^n - 1)
```

Where:
- `P` = principal (current balance)
- `r` = monthly interest rate (APR / 12 / 100)
- `n` = number of months

## Payoff Simulation Algorithm

This is a simplified sketch — the authoritative implementation is `scripts/debt_model.py`; run that script rather than reimplementing from this sketch. The real script uses two phases per month so that a freed-up minimum payment (from a debt that just got paid off) is redirected to the next target debt within the same month, not just the original `extra_payment`:

```python
def simulate_payoff(debts, extra_payment, strategy="avalanche"):
    """
    debts: list of {name, balance, apr, min_payment}
    extra_payment: additional dollars per month beyond minimums
    strategy: "avalanche" (highest APR first) or "snowball" (lowest balance first)
    Returns: payoff timeline, total interest, per-debt summary
    """
    active = [d.copy() for d in debts]
    if strategy == "avalanche":
        active.sort(key=lambda d: d["apr"], reverse=True)
    else:
        active.sort(key=lambda d: d["balance"])

    total_budget = sum(d["min_payment"] for d in active) + extra_payment
    months = 0
    total_interest = 0

    while any(d["balance"] > 0.01 for d in active) and months < 1200:  # 100-year safety limit
        months += 1
        remaining = total_budget

        # Phase 1: accrue interest and pay minimums on every active debt
        for debt in active:
            if debt["balance"] <= 0.01:
                continue
            interest = debt["balance"] * (debt["apr"] / 100 / 12)
            debt["balance"] += interest
            total_interest += interest
            payment = min(debt["min_payment"], debt["balance"], remaining)
            debt["balance"] -= payment
            remaining -= payment

        # Phase 2: redirect whatever budget is left (extra + freed-up minimums)
        # to debts in payoff order
        for debt in active:
            if remaining <= 0.01:
                break
            if debt["balance"] <= 0.01:
                continue
            payment = min(debt["balance"], remaining)
            debt["balance"] -= payment
            remaining -= payment

    return {
        "months_to_debt_free": months,
        "total_interest": round(total_interest, 2),
        "strategy": strategy,
    }
```

## Output Table Format

```
| Debt Name   | Starting Balance | APR   | Payoff Month | Total Interest | Total Paid   |
|-------------|-----------------|-------|--------------|----------------|-------------|
| Visa        | $5,200           | 24.9% | Month 8      | $485           | $5,685       |
| Student Loan| $35,000          | 6.5%  | Month 42     | $4,210         | $39,210      |
| Mortgage    | $280,000         | 3.8%  | Month 360    | $188,500       | $468,500     |
```

Plus an overall summary:
```
Total time to debt-free: X years and Y months
Total interest paid across all debts: $Z
```
