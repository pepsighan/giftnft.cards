import { GiftCard } from "store/gifts";

/**
 * Convert the GiftCard tuple from the smart contract into a js object.
 */
export function convertGiftCardTupleToObject(tuple: any[]): GiftCard {
  const [
    tokenId,
    amount,
    imageDataUrl,
    message,
    signedBy,
    mintedBy,
    isUnwrapped,
    isBurnt,
    timestamp,
    isInitialized,
  ] = tuple;

  return {
    tokenId,
    amount,
    imageDataUrl,
    message,
    signedBy,
    mintedBy,
    isUnwrapped,
    isBurnt,
    timestamp,
    isInitialized,
  };
}
