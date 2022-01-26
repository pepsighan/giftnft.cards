/**
 * Calculates the amount in Wei for the amount of $Metis.
 */
export function calculateWei(amount: string): number {
  const multiplier = 10 ** 18;
  return Math.floor(Number(amount) * multiplier);
}

/**
 * Format the amount to string.
 */
export function formatAmount(amount: string) {
  if (!amount) {
    return "";
  }

  return `$METIS ${amount}`;
}
