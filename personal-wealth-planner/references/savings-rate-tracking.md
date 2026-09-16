# Savings Rate Tracking — Detailed Reference

## Savings Rate Formula

```
savings_rate = (monthly_savings / monthly_income) * 100
```

Use net income (after taxes) unless the user specifies gross income.

## Benchmark Scale

| Savings Rate | Assessment |
|-------------|------------|
| 0–5% | Needs improvement — vulnerable to financial shocks |
| 5–10% | Building momentum — adequate for short-term goals |
| 10–15% | On track — meets standard retirement planning benchmarks |
| 15–20% | Strong — accelerated wealth building |
| 20%+ | Aggressive — FIRE-track or early retirement territory |

## Projection Formulas

**Future Value of a Series (monthly contributions with compound growth):**

```
FV = PMT * [((1 + r)^n - 1) / r] * (1 + r)
```

Where:
- `FV` = future value
- `PMT` = monthly contribution
- `r` = monthly interest rate (annual_rate / 12)
- `n` = number of months

**Future Value of current savings (lump sum):**

```
FV_lump = PV * (1 + r)^n
```

**Total projected balance:**

```
total = FV + FV_lump
```

## Python Implementation

```python
def project_savings(monthly_savings, current_savings, annual_return, years):
    r = annual_return / 12
    n = years * 12
    fv_series = monthly_savings * (((1 + r) ** n - 1) / r) * (1 + r)
    fv_lump = current_savings * (1 + r) ** n
    return round(fv_series + fv_lump, 2)
```

## Annual Raise Adjustment

If the user provides an expected annual raise percentage, adjust the monthly contribution each year:

```python
def project_with_raises(monthly_savings, annual_raise, annual_return, years):
    balance = 0
    current_savings = monthly_savings
    for year in range(years):
        r = annual_return / 12
        for month in range(12):
            balance = (balance + current_savings) * (1 + r)
        current_savings *= (1 + annual_raise)
    return round(balance, 2)
```
