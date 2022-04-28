import BigNumber from 'bignumber.js';

/**
 * Calculates the amount in Wei for the amount of $Metis.
 */
export function calculateWei(amount: string): BigNumber {
  return new BigNumber(amount)
    .multipliedBy(new BigNumber(10).pow(18))
    .integerValue();
}

const oneMetis = new BigNumber(10).pow(18);

/**
 * Minimum gift value is 0.1 Metis.
 */
export const minGiftValue = oneMetis.div(10);

/**
 * Calculates the mint fees in Wei for the amount.
 * Fees are 5% capped at 1 $Metis.
 */
export function calculateMintFee(amount: BigNumber): BigNumber {
  let fee = amount.multipliedBy(5).div(100);
  if (fee.gt(oneMetis)) {
    fee = oneMetis;
  }

  return fee;
}

/**
 * Format the amount (in Metis) to string.
 */
export function formatAmount(amount?: string): string {
  if (!amount) {
    return '';
  }

  return `${Number(amount)} METIS`;
}

/**
 * Format the amount (in Wei) to string.
 */
export function formatWeiAmount(amount?: string): string {
  if (!amount) {
    return '';
  }

  const wei = new BigNumber(amount);
  return formatAmount(wei.div(new BigNumber(10).pow(18)).toString());
}
