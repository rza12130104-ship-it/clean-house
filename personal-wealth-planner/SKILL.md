---
name: personal-wealth-planner
description: "Use for personal wealth planning: savings-rate tracking, debt payoff modeling, investment-goal planning, retirement/FIRE targets, and monthly net-worth summaries. Do not use for stock quotes, public-market research, company financials, or institutional finance."
license: MIT
metadata:
  version: '1.0'
---

# Personal Wealth Planner

A simplified personal finance skill for everyday wealth management. Distilled from professional financial-planning workflows into four practical tools the user can run in any conversation.

## When to Use This Skill

Load this skill when the user asks about any of the following:

- Calculating or tracking their personal savings rate
- Modeling debt repayment for student loans, mortgages, credit cards, or auto loans
- Setting or reviewing long-term investment goals (retirement, FIRE, major purchases)
- Generating a monthly net-worth summary
- General personal financial planning, budgeting strategy, or wealth-building questions

Do not load this skill for: public stock prices, market analysis, company financials, earnings calls, or institutional/corporate finance. Those belong to the finance skill.

## Core Workflows

### 1. Savings Rate Tracker

**What it does:** Calculates the user's savings rate and projects wealth accumulation over time.

**Inputs needed from the user:**
- Monthly gross or net income
- Monthly savings amount (or monthly expenses to derive savings)
- Optional: annual raise percentage, expected investment return rate

**Calculation:**
```
savings_rate = monthly_savings / monthly_net_income * 100
```

**Steps:**
1. Ask the user for income and savings (or expenses) figures if not provided
2. Calculate the savings rate as a percentage
3. Project cumulative savings over 1, 5, 10, 20, and 30 years using compound growth
4. Present results in a summary table with year, projected balance, and growth breakdown

**Output format:** A markdown table showing projected savings growth over time, plus a one-line verdict (e.g., "You are saving 18% of net income — above the 15% benchmark recommended for long-term wealth building").

For benchmark comparison and detailed projection formulas, read `references/savings-rate-tracking.md`.

### 2. Debt Repayment Modeler

**What it does:** Models payoff timelines for one or more debts using avalanche (highest interest first) or snowball (lowest balance first) methods.

**Inputs needed from the user:**
- Debt name, current balance, interest rate (APR), and minimum monthly payment for each debt
- Optional: extra monthly payment available beyond minimums
- Optional: preferred strategy (avalanche, snowball, or custom)

**Steps:**
1. Collect debt details — ask for each debt's balance, APR, and minimum payment
2. Ask which strategy the user prefers (default to avalanche if not specified)
3. Run the payoff model using the Python script at `scripts/debt_model.py` — pass debts as a JSON array
4. Present results: payoff order, time-to-debt-free, total interest paid, and month-by-month summary for the first 12 months

**Output format:** A summary table per debt (payoff month, total interest, total paid) and an overall timeline. Include a comparison line: "The avalanche method saves $X in interest vs. the snowball method."

For amortization formulas and strategy comparison details, read `references/debt-modeling.md`.

### 3. Investment Goal Planner

**What it does:** Sets a long-term investment target and calculates what it takes to get there.

**Inputs needed from the user:**
- Target amount (e.g., $1M for retirement, $500K for a home)
- Time horizon (years to goal)
- Current invested savings
- Expected annual return rate (default 7% if not provided)
- Optional: current monthly contribution

**Steps:**
1. Collect goal details from the user
2. Calculate the required monthly contribution to reach the target using future value of an annuity formula
3. If the user provides a current contribution, calculate projected outcome and shortfall/surplus
4. Present a milestone table showing projected balance at 25%, 50%, 75%, and 100% of the time horizon

**Output format:** A table with milestone years and projected balances, plus a clear statement of the required monthly contribution and whether the user's current pace is on track.

For formulas and FIRE (Financial Independence, Retire Early) planning details, read `references/investment-goal-planning.md`.

### 4. Monthly Net-Worth Summary

**What it does:** Generates a structured net-worth snapshot the user can update each month.

**Inputs needed from the user:**
- Assets: cash, checking, savings, investment accounts, retirement accounts, real estate, other
- Liabilities: mortgage, student loans, credit cards, auto loans, other debts

**Steps:**
1. Ask the user for asset and liability values (or accept them in a single message)
2. Calculate net worth: `total_assets - total_liabilities`
3. If previous month's data is available (from memory or prior conversation), calculate month-over-month change
4. Present the summary using the template at `templates/net-worth-summary.md`

**Output format:** A formatted net-worth statement with assets, liabilities, net worth, and delta from last month. If the environment supports persistent memory or notes, offer to save the snapshot so it can be referenced in future conversations. Otherwise, suggest the user keep a copy of the output.

## General Rules

- Always use the user's currency (default USD if not specified)
- Round all displayed figures to whole dollars unless the user requests cents
- When the user provides raw numbers without context, confirm which figures are assets vs. liabilities before calculating
- If the user mentions connected financial accounts (bank feeds, portfolio trackers), suggest pulling live data from those sources first, then use this skill for the planning calculations
- For any projection, clearly state the assumed return rate and note that actual returns may vary
- Keep explanations concise — the user wants actionable numbers, not financial theory lectures

## Input/Output Example

**User input:**
"I make $6,000/month net and save $900. What's my savings rate and where will I be in 10 years at 7% return?"

**Expected output:**
```
Your savings rate is 15.0% of net income.

| Year | Projected Balance | Interest Earned |
|------|-------------------|-----------------|
| 1    | $11,218           | $418            |
| 5    | $64,809           | $10,809         |
| 10   | $156,685          | $48,685         |

At 15% savings, you're meeting the recommended benchmark for long-term wealth building. Over 10 years at 7% annual return, your projected balance reaches $156,685.
```

## Scripts

- `scripts/debt_model.py` — Debt payoff modeler. Run with `python3 scripts/debt_model.py` and pass debts as a JSON array via stdin. Outputs payoff timeline, total interest, and strategy comparison.
