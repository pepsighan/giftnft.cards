import { useQuery, useQueryClient } from 'react-query';
import { useAccount } from 'store/account';
import { useCallback, useEffect } from 'react';
import { getContract, getEthers } from 'utils/metamask';
import { ethers } from 'ethers';
import { convertGiftCardTupleToObject } from 'utils/conversion';
import axios from 'axios';
import { getStorage, ref, StringFormat, uploadString } from '@firebase/storage';
import { firebaseApp } from 'utils/firebase';
import { v4 as uuidv4 } from 'uuid';

export type GiftCard = {
  tokenId: ethers.BigNumber;
  amount: ethers.BigNumber;
  imageDataUrl: string;
  message: string;
  signedBy: string;
  mintedBy: string;
  isBurnt: boolean;
  isUnwrapped: boolean;
  timestamp: number;
  isInitialized: boolean;
};

/**
 * Fetch all the gift cards owned by the current selected account.
 */
export function useMyGifts() {
  const accountId = useAccount(useCallback((state) => state.accountId, []));

  const { refetch, ...rest } = useQuery<GiftCard[]>(
    'use-my-gifts',
    useCallback<() => Promise<GiftCard[]>>(async () => {
      if (!accountId) {
        return [];
      }

      const contract = await getContract();
      if (!contract) {
        return [];
      }

      const giftsCount = await contract.balanceOf(accountId);
      const cards: GiftCard[] = await Promise.all(
        Array(giftsCount.toNumber())
          .fill(0)
          .map(async (_, index) => {
            const tuple = await contract.getGiftCardByIndex(index);
            return convertGiftCardTupleToObject(tuple);
          })
      );

      // Put all the unwrapped cards at the last and order the latest ones first.
      return cards.reverse().sort((left, right) => {
        if (left.isUnwrapped !== right.isUnwrapped) {
          if (left.isUnwrapped) {
            return 1;
          }
          return -1;
        }

        return 0;
      });
    }, [accountId]),
    // Refetch every 5 seconds.
    { refetchInterval: 5_000 }
  );

  useEffect(() => {
    // Refetch when account id changes.
    if (accountId) {
      refetch();
    }
  }, [refetch, accountId]);

  return { refetch, ...rest };
}

/**
 * Fetch all the gifts sent by the selected account.
 */
export function useSentGifts() {
  return useQuery<GiftCard[]>(
    'use-sent-gifts',
    useCallback<() => Promise<GiftCard[]>>(async () => {
      const contract = await getContract();
      if (!contract) {
        return [];
      }

      const giftsCount = await contract.lengthOfSentGiftCards();
      const gifts = await Promise.all(
        Array(giftsCount.toNumber())
          .fill(0)
          .map(async (_, index) => {
            const tuple = await contract.getSentGiftCardByIndex(index);
            return convertGiftCardTupleToObject(tuple);
          })
      );

      // Show the latest ones first.
      return gifts.reverse();
    }, []),
    // Refetch every 5 seconds.
    { refetchInterval: 5_000 }
  );
}

type NewGiftCard = {
  recipient: string;
  amount: string;
  imageDataUrl: string;
  message: string;
  signedBy: string;
};

/**
 * Mint a new gift card.
 */
export function useMintGiftCard() {
  const client = useQueryClient();

  return useCallback(
    async (arg: NewGiftCard) => {
      const contract = await getContract();
      if (!contract) {
        return;
      }

      // Upload the image to firebase storage and store it in the gift card nft.
      const storage = getStorage(firebaseApp);
      const filepath = `cards/${uuidv4()}`;
      const imageRef = ref(storage, filepath);
      await uploadString(imageRef, arg.imageDataUrl, StringFormat.DATA_URL);

      const tx = await contract.safeMint(
        arg.recipient,
        filepath,
        arg.message,
        arg.signedBy,
        // Send the following amount to be wrapped in the gift card.
        { value: arg.amount }
      );
      await tx.wait();

      // Refetch the gifts.
      await Promise.all([
        client.invalidateQueries('use-my-gifts'),
        client.invalidateQueries('use-sent-gifts'),
      ]);
    },
    [client]
  );
}

/**
 * Unwraps the gift card and draws the value stored in it to the withholding account.
 */
export function useUnwrapGift() {
  const client = useQueryClient();

  return useCallback(
    async (tokenId: string) => {
      const eths = await getEthers();
      if (!eths) {
        return;
      }

      const network = useAccount.getState().network;

      // This will let the backend know if the unwrap request is from the owner itself.
      const signer = eths.getSigner();
      const owner = await signer.getAddress();
      const signature = await signer.signMessage(
        `Token ID: ${tokenId}\nOwner: ${owner}`
      );

      await axios.post(`/api/${network}/unwrap`, {
        tokenId,
        owner,
        signature,
      });
      // Refetch the gifts.
      await Promise.all([
        client.invalidateQueries('use-my-gifts'),
        client.invalidateQueries('use-sent-gifts'),
      ]);
    },
    [client]
  );
}

/**
 * Unwraps the gift card and draws the value stored in it to the withholding account. The
 * transaction is executed by the caller.
 */
export function useUnwrapGiftBySelf() {
  const client = useQueryClient();

  return useCallback(
    async (tokenId: string) => {
      const contract = await getContract();
      if (!contract) {
        return;
      }
      await contract.unwrapGiftCard(tokenId);

      // Refetch the gifts.
      await Promise.all([
        client.invalidateQueries('use-my-gifts'),
        client.invalidateQueries('use-sent-gifts'),
      ]);
    },
    [client]
  );
}

/**
 * Get the unwrap fee for a given token.
 */
export function useUnwrapFee(tokenId: string, enabled: boolean) {
  const accountId = useAccount(useCallback((state) => state.accountId, []));
  const network = useAccount(useCallback((state) => state.network, []));

  return useQuery(
    `unwrap-fee-${tokenId}-${accountId}`,
    () =>
      axios
        .get(`/api/${network}/unwrap-fee?tokenId=${tokenId}&owner=${accountId}`)
        .then((response) => response.data),
    // Refetch every 10 seconds.
    { refetchInterval: 10_000, enabled }
  );
}
