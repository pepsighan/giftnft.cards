import BigNumber from "bignumber.js";

/**
 * Calculates the amount in Wei for the amount of $Metis.
 */
export function calculateWei(amount: string): BigNumber {
  return new BigNumber(amount)
    .multipliedBy(new BigNumber(10).pow(18))
    .integerValue();
}

/**
 * Format the amount (in Metis) to string.
 */
export function formatAmount(amount?: string): string {
  if (!amount) {
    return "";
  }

  return `${Number(amount)} METIS`;
}

/**
 * Format the amount (in Wei) to string.
 */
export function formatWeiAmount(amount?: string): string {
  if (!amount) {
    return "";
  }

  const wei = new BigNumber(amount);
  return formatAmount(wei.div(new BigNumber(10).pow(18)).toString());
}
