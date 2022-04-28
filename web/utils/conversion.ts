import { GiftCard } from 'store/gifts';

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

  let url: string = imageDataUrl;
  // This is an image stored in firebase storage.
  if (imageDataUrl.startsWith('cards/')) {
    url = `https://storage.googleapis.com/giftnftcards.appspot.com/${imageDataUrl}`;
  }

  return {
    tokenId,
    amount,
    imageDataUrl: url,
    message,
    signedBy,
    mintedBy,
    isUnwrapped,
    isBurnt,
    timestamp,
    isInitialized,
  };
}
