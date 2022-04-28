import { useQuery } from 'react-query';
import { useCallback } from 'react';
import { getContract } from 'utils/metamask';
import { GiftCard } from 'store/gifts';

/**
 * Gets the owner of the token.
 */
export function useOwnerOfNFT(tokenId: string, enabled: boolean) {
  return useQuery<GiftCard[]>(
    `use-owner-of-nft-${tokenId}`,
    useCallback<() => Promise<GiftCard[]>>(async () => {
      const contract = await getContract();
      if (!contract) {
        return [];
      }

      return await contract.ownerOf(tokenId);
    }, [tokenId]),
    { enabled }
  );
}
