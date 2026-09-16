#!/usr/bin/env python3
"""Debt Repayment Modeler — avalanche and snowball payoff simulation.

Usage:
    echo '[{"name":"Visa","balance":5200,"apr":24.9,"min_payment":150},...]' | python3 debt_model.py
    python3 debt_model.py --extra 200 < debts.json

Reads a JSON array of debt objects from stdin. Each debt needs:
    name (str), balance (float), apr (float, percent), min_payment (float)

Optional flags:
    --extra FLOAT   Extra monthly payment beyond minimums (default: 0)
    --strategy STR  "avalanche" (default) or "snowball"
"""

import json
import sys
import argparse


def simulate_payoff(debts, extra_payment=0, strategy="avalanche"):
    """Simulate debt payoff and return timeline, interest, and per-debt summary.

    Budget model: total monthly budget = sum of all minimum payments + extra.
    Each month, pay minimums on all active debts, then redirect remaining
    budget (including freed-up minimums from paid-off debts) to the current
    target debt in payoff order.
    """
    # Work on copies
    active = []
    for d in debts:
        active.append({
            "name": d["name"],
            "balance": float(d["balance"]),
            "apr": float(d["apr"]),
            "min_payment": float(d["min_payment"]),
            "starting_balance": float(d["balance"]),
            "payoff_month": None,
            "total_interest": 0.0,
            "total_paid": 0.0,
        })

    # Sort by strategy
    if strategy == "avalanche":
        active.sort(key=lambda d: d["apr"], reverse=True)
    elif strategy == "snowball":
        active.sort(key=lambda d: d["balance"])
    else:
        active.sort(key=lambda d: d["apr"], reverse=True)

    # Total monthly budget = sum of all minimums + extra
    total_monthly_budget = sum(d["min_payment"] for d in active) + extra_payment

    months = 0
    total_interest = 0.0
    SAFETY_LIMIT = 1200  # 100 years

    while any(d["balance"] > 0.01 for d in active) and months < SAFETY_LIMIT:
        months += 1
        remaining_budget = total_monthly_budget

        # Phase 1: Pay minimums on all active debts
        for debt in active:
            if debt["balance"] <= 0.01:
                continue

            # Apply monthly interest
            interest = debt["balance"] * (debt["apr"] / 100 / 12)
            debt["balance"] += interest
            debt["total_interest"] += interest
            total_interest += interest

            # Pay minimum (or remaining balance if less)
            payment = min(debt["min_payment"], debt["balance"], remaining_budget)
            debt["balance"] -= payment
            debt["total_paid"] += payment
            remaining_budget -= payment

            if debt["balance"] <= 0.01 and debt["payoff_month"] is None:
                debt["payoff_month"] = months

        # Phase 2: Redirect remaining budget to target debts in payoff order
        for debt in active:
            if remaining_budget <= 0.01:
                break
            if debt["balance"] <= 0.01:
                continue

            payment = min(debt["balance"], remaining_budget)
            debt["balance"] -= payment
            debt["total_paid"] += payment
            remaining_budget -= payment

            if debt["balance"] <= 0.01 and debt["payoff_month"] is None:
                debt["payoff_month"] = months

    # Round results
    for d in active:
        d["total_interest"] = round(d["total_interest"], 2)
        d["total_paid"] = round(d["total_paid"], 2)
        d["balance"] = round(max(0, d["balance"]), 2)

    return {
        "months_to_debt_free": months,
        "years": months // 12,
        "remaining_months": months % 12,
        "total_interest": round(total_interest, 2),
        "strategy": strategy,
        "debts": active,
    }


def format_results(result):
    """Format results as a human-readable summary."""
    lines = []
    lines.append(f"Strategy: {result['strategy'].capitalize()}")
    lines.append(f"Time to debt-free: {result['years']} years, {result['remaining_months']} months")
    lines.append(f"Total interest paid: ${result['total_interest']:,.2f}")
    lines.append("")
    lines.append("| Debt Name       | Starting Balance | APR    | Payoff Month  | Total Interest | Total Paid    |")
    lines.append("|-----------------|------------------|--------|---------------|----------------|---------------|")
    for d in result["debts"]:
        payoff = f"Month {d['payoff_month']}" if d["payoff_month"] else "Not paid off"
        lines.append(
            f"| {d['name']:<15} | ${d['starting_balance']:>14,.2f} | {d['apr']:>5.1f}% | {payoff:<13} | ${d['total_interest']:>13,.2f} | ${d['total_paid']:>13,.2f} |"
        )
    lines.append("")
    lines.append(f"**Total time to debt-free: {result['years']} years and {result['remaining_months']} months**")
    lines.append(f"**Total interest paid across all debts: ${result['total_interest']:,.2f}**")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Debt Repayment Modeler")
    parser.add_argument("--extra", type=float, default=0, help="Extra monthly payment beyond minimums")
    parser.add_argument("--strategy", choices=["avalanche", "snowball"], default="avalanche", help="Payoff strategy")
    args = parser.parse_args()

    # Read JSON from stdin
    raw = sys.stdin.read().strip()
    if not raw:
        print("Error: No input provided. Pass a JSON array of debts via stdin.", file=sys.stderr)
        sys.exit(1)

    try:
        debts = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)

    if not isinstance(debts, list) or not debts:
        print("Error: Input must be a non-empty JSON array of debts.", file=sys.stderr)
        sys.exit(1)

    required_keys = {"name", "balance", "apr", "min_payment"}
    for i, d in enumerate(debts):
        if not isinstance(d, dict) or not required_keys.issubset(d):
            missing = required_keys - (d.keys() if isinstance(d, dict) else set())
            print(f"Error: Debt at index {i} is missing required field(s): {', '.join(sorted(missing))}", file=sys.stderr)
            sys.exit(1)

    # Run both strategies for comparison
    avalanche = simulate_payoff(debts, args.extra, "avalanche")
    snowball = simulate_payoff(debts, args.extra, "snowball")

    requested = avalanche if args.strategy == "avalanche" else snowball

    print("=" * 70)
    print(f"  {args.strategy.upper()} STRATEGY (requested)")
    print("=" * 70)
    print(format_results(requested))
    print()
    print("=" * 70)
    print("  STRATEGY COMPARISON")
    print("=" * 70)
    print(f"Avalanche:  {avalanche['years']}y {avalanche['remaining_months']}m  |  Total interest: ${avalanche['total_interest']:,.2f}")
    print(f"Snowball:   {snowball['years']}y {snowball['remaining_months']}m  |  Total interest: ${snowball['total_interest']:,.2f}")
    diff = abs(avalanche["total_interest"] - snowball["total_interest"])
    winner = "Avalanche" if avalanche["total_interest"] <= snowball["total_interest"] else "Snowball"
    print(f"\n{winner} saves ${diff:,.2f} in interest.")


if __name__ == "__main__":
    main()
