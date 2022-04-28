import create from 'zustand';
import { useCallback, useEffect } from 'react';
import { useAsync } from 'react-use';
import { getMetamask } from 'utils/metamask';
import config from 'utils/config';

type UseAccountStore = {
  network: 'mainnet' | 'testnet';
  accountId: string | null;
  chainId: number | null;
};

/**
 * Stores the current account information in the wallet accessible to the app.
 */
export const useAccount = create<UseAccountStore>(() => ({
  network: 'mainnet',
  accountId: null,
  chainId: null,
}));

/**
 * Initialized account information that are accessible to the app.
 */
export function useInitializeAccount() {
  // Listen to accounts changes on the metamask and update them.
  const { value: metamask } = useAsync(useCallback(() => getMetamask(), []));

  useEffect(() => {
    if (!metamask) {
      return;
    }

    const onAccountsChanged = (accounts: string[]) => {
      // Store the first account. If the user switches the account on the
      // wallet, we will be able to fetch it immediately.
      if (accounts.length > 0) {
        useAccount.setState({ accountId: accounts[0] });
      } else {
        useAccount.setState({ accountId: null });
      }
    };

    const onChainChanged = (chainId: number | string) => {
      let newChainId: number;

      if (typeof chainId === 'string') {
        // Expecting hex-number.
        newChainId = Number(chainId);
      } else {
        newChainId = chainId;
      }

      // Also, switch the network kind.
      if (newChainId === config.MAINNET_CHAIN_ID) {
        useAccount.setState({ network: 'mainnet' });
      } else if (newChainId === config.TESTNET_CHAIN_ID) {
        useAccount.setState({ network: 'testnet' });
      }

      useAccount.setState({ chainId: newChainId });
    };

    // Fetch the account and chain ID when the app is loaded for the first time.
    const onInitialization = async () => {
      const accounts = await metamask.request({
        method: 'eth_accounts',
      });
      const chainID = await metamask.request({
        method: 'eth_chainId',
      });
      onAccountsChanged(accounts);
      onChainChanged(chainID);
    };
    onInitialization();

    metamask.on('accountsChanged', onAccountsChanged);
    metamask.on('chainChanged', onChainChanged);

    return () => {
      metamask.removeListener('accountsChanged', onAccountsChanged);
      metamask.removeListener('chainChanged', onChainChanged);
    };
  }, [metamask]);
}
