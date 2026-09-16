# Investment Goal Planning — Detailed Reference

## Future Value of an Annuity (required monthly contribution)

To find the monthly contribution needed to reach a target:

```
PMT = FV * r / [((1 + r)^n - 1) * (1 + r)]
```

Where:
- `FV` = target future value
- `r` = monthly interest rate (annual_return / 12)
- `n` = number of months

## Projected Balance at Target

To project what a current contribution will grow to:

```
FV = PMT * [((1 + r)^n - 1) / r] * (1 + r) + PV * (1 + r)^n
```

Where `PV` is current invested savings.

## Python Implementation

```python
def required_monthly_contribution(target, years, annual_return, current_savings=0):
    r = annual_return / 12
    n = years * 12
    # Subtract future value of current savings from target
    fv_current = current_savings * (1 + r) ** n
    remaining_target = max(0, target - fv_current)
    if r == 0:
        return remaining_target / n
    pmt = remaining_target * r / (((1 + r) ** n - 1) * (1 + r))
    return round(pmt, 2)

def projected_balance(monthly_contribution, years, annual_return, current_savings=0):
    r = annual_return / 12
    n = years * 12
    fv_series = monthly_contribution * (((1 + r) ** n - 1) / r) * (1 + r)
    fv_lump = current_savings * (1 + r) ** n
    return round(fv_series + fv_lump, 2)
```

## Milestone Table Format

```
| Milestone        | Year | Projected Balance | % of Goal |
|------------------|------|-------------------|-----------|
| Quarter mark     | 7    | $185,000          | 25%       |
| Halfway          | 14   | $445,000          | 50%       |
| Three-quarters   | 21   | $780,000          | 75%       |
| Goal reached     | 28   | $1,050,000        | 100%      |
```

## FIRE (Financial Independence, Retire Early) Planning

For FIRE calculations, use the 4% rule as a starting point:

```
fire_number = annual_expenses * 25
```

Then calculate required monthly contributions to reach `fire_number` by the user's target retirement age.

### FIRE Savings Rate Map

| Savings Rate | Years to FIRE (at 5% real return) |
|-------------|-----------------------------------|
| 10%          | ~51 years                         |
| 15%          | ~43 years                         |
| 25%          | ~32 years                         |
| 40%          | ~22 years                         |
| 50%          | ~17 years                         |
| 65%          | ~10 years                         |

Note: These assume 5% real return after inflation. Actual timelines depend on return rate, inflation, and withdrawal strategy.
