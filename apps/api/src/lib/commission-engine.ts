/**
 * AutoComm Commission Engine
 *
 * Implements the PRD combination model: flat commission + tiered bonus.
 * - Flat: A fixed percentage applied to the transaction's total sales.
 * - Tiered: A bonus rate determined by the agent's cumulative sales volume hitting certain thresholds.
 */

export interface TierDefinition {
  tierOrder: number;
  minVolume: number;
  maxVolume: number | null; // null = unlimited
  commissionRate: number;   // e.g. 0.0025 = 0.25%
}

export interface CalculationInput {
  /** The dollar amount of the current transaction */
  totalSales: number;
  /** Agent's accumulated sales volume (for tier threshold checks) */
  cumulativeSales: number;
  /** Flat rate from the commission rule (e.g. 0.0525 = 5.25%) */
  flatRate: number;
  /** Ordered tier definitions (only used if rule type = 'tiered') */
  tiers: TierDefinition[];
}

export interface TierBreakdown {
  tierOrder: number;
  minVolume: number;
  maxVolume: number | null;
  rate: number;
  applied: boolean;
}

export interface CalculationResult {
  flatCommission: number;
  tieredBonus: number;
  totalCommission: number;
  effectiveRate: number;
  breakdown: TierBreakdown[];
}

/**
 * Calculate commission for a single transaction using flat + tiered combo model.
 */
export function calculateCommission(input: CalculationInput): CalculationResult {
  const { totalSales, cumulativeSales, flatRate, tiers } = input;

  // 1. Flat commission
  const flatCommission = roundCurrency(totalSales * flatRate);

  // 2. Find the highest-matching tier based on cumulative sales
  let tieredBonus = 0;
  const sortedTiers = [...tiers].sort((a, b) => a.tierOrder - b.tierOrder);

  const breakdown: TierBreakdown[] = sortedTiers.map((tier) => {
    const withinRange =
      cumulativeSales >= tier.minVolume &&
      (tier.maxVolume === null || cumulativeSales <= tier.maxVolume);

    return {
      tierOrder: tier.tierOrder,
      minVolume: tier.minVolume,
      maxVolume: tier.maxVolume,
      rate: tier.commissionRate,
      applied: withinRange,
    };
  });

  // Apply the highest matching tier (last one that matches in sorted order)
  const matchingTiers = breakdown.filter((t) => t.applied);
  if (matchingTiers.length > 0) {
    const highestTier = matchingTiers[matchingTiers.length - 1];
    tieredBonus = roundCurrency(totalSales * highestTier.rate);
  }

  const totalCommission = roundCurrency(flatCommission + tieredBonus);
  const effectiveRate = totalSales > 0 ? totalCommission / totalSales : 0;

  return {
    flatCommission,
    tieredBonus,
    totalCommission,
    effectiveRate,
    breakdown,
  };
}

/**
 * Simulate the effective rate for a rule based on a hypothetical volume.
 * Used by the "Simulated Outcome" widget in NewCommissionRule.
 */
export function simulateEffectiveRate(
  flatRate: number,
  tiers: TierDefinition[],
  simulatedVolume: number
): number {
  const result = calculateCommission({
    totalSales: simulatedVolume,
    cumulativeSales: simulatedVolume,
    flatRate,
    tiers,
  });
  return result.effectiveRate;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
