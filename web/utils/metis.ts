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
 * Format the amount to string.
 */
export function formatAmount(amount?: string) {
  if (!amount) {
    return "";
  }

  return `$METIS ${amount}`;
}
