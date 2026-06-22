/**
 * ROI calculator math (PRD §2.6).
 *
 * Models the money leaking out of a funnel through slow/missed replies, and how much an
 * always-on AI agent could recover. Pure functions — no I/O — so they're trivially testable
 * and reused by both the /api/roi route and any client-side live preview.
 */

import type { RoiInput } from "@/lib/validation";

/** Tunable assumptions. Defaults are deliberately conservative for an honest pitch. */
export const ROI_DEFAULTS = {
  /** Of enquiries that get a real reply, how many become paying customers. */
  closeRatePercent: 25,
  /** Share of currently missed/slow enquiries an AI agent realistically recovers. */
  recoveryRate: 0.7,
} as const;

export interface RoiResult {
  /** Echo of the (normalised) inputs used. */
  inputs: {
    enquiriesPerMonth: number;
    percentMissed: number;
    avgCustomerValue: number;
    closeRatePercent: number;
  };
  /** Enquiries lost to slow/no reply each month. */
  missedEnquiriesPerMonth: number;
  /** Revenue lost each month because those enquiries were never answered. */
  lostRevenuePerMonth: number;
  /** Same, annualised. */
  lostRevenuePerYear: number;
  /** Revenue an AI agent could plausibly recover per month / year. */
  recoverableRevenuePerMonth: number;
  recoverableRevenuePerYear: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateRoi(input: RoiInput): RoiResult {
  const enquiriesPerMonth = Math.max(0, input.enquiriesPerMonth);
  const percentMissed = clampPercent(input.percentMissed);
  const avgCustomerValue = Math.max(0, input.avgCustomerValue);
  const closeRatePercent = clampPercent(input.closeRatePercent ?? ROI_DEFAULTS.closeRatePercent);

  const missedEnquiriesPerMonth = enquiriesPerMonth * (percentMissed / 100);
  const lostRevenuePerMonth = missedEnquiriesPerMonth * (closeRatePercent / 100) * avgCustomerValue;
  const recoverableRevenuePerMonth = lostRevenuePerMonth * ROI_DEFAULTS.recoveryRate;

  return {
    inputs: { enquiriesPerMonth, percentMissed, avgCustomerValue, closeRatePercent },
    missedEnquiriesPerMonth: round2(missedEnquiriesPerMonth),
    lostRevenuePerMonth: round2(lostRevenuePerMonth),
    lostRevenuePerYear: round2(lostRevenuePerMonth * 12),
    recoverableRevenuePerMonth: round2(recoverableRevenuePerMonth),
    recoverableRevenuePerYear: round2(recoverableRevenuePerMonth * 12),
  };
}

function clampPercent(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

/** Format a number as whole-dollar currency for emails/UI (USD default; pass a locale/currency to change). */
export function formatMoney(amount: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
