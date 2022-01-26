import { useQuery, useQueryClient } from "react-query";
import { useAccount } from "store/account";
import { useCallback, useEffect } from "react";
import { getContract, getEthers } from "utils/metamask";
import { ethers } from "ethers";
import { convertGiftCardTupleToObject } from "utils/conversion";
import ky from "ky";

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
    "use-my-gifts",
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
    "use-sent-gifts",
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
      await contract.safeMint(
        arg.recipient,
        arg.imageDataUrl,
        arg.message,
        arg.signedBy,
        // Send the following amount to be wrapped in the gift card.
        { value: arg.amount }
      );

      // Refetch the gifts.
      await Promise.all([
        client.invalidateQueries("use-my-gifts"),
        client.invalidateQueries("use-sent-gifts"),
      ]);
    },
    [client]
  );
}

/**
 * Unwraps the gift card and draws the value stored in it to the withholding account.
 * This does not however burn the token.
 */
export function useUnwrapGift() {
  const client = useQueryClient();

  return useCallback(
    async (tokenId: string) => {
      const eths = await getEthers();
      if (!eths) {
        return;
      }

      // This will let the backend know if the unwrap request is from the owner itself.
      const signer = eths.getSigner();
      const owner = await signer.getAddress();
      const msgHash = ethers.utils.solidityKeccak256(
        ["uint256", "address"],
        [tokenId, owner]
      );
      const signature = await signer.signMessage(
        ethers.utils.arrayify(msgHash)
      );

      await ky.post("/api/unwrap", {
        json: {
          tokenId,
          owner,
          signature,
        },
      });
      // Refetch the gifts.
      await Promise.all([
        client.invalidateQueries("use-my-gifts"),
        client.invalidateQueries("use-sent-gifts"),
      ]);
    },
    [client]
  );
}
