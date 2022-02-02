import { useCallback } from "react";
import config from "utils/config";
import { getMetamask } from "utils/metamask";
import { useAccount } from "store/account";

/**
 * Add a network in metamask.
 */
export function useAddNetwork() {
  return useCallback(async () => {
    const network = useAccount.getState().network;
    const chainId =
      network === "mainnet" ? config.MAINNET_CHAIN_ID : config.TESTNET_CHAIN_ID;

    const metamask = await getMetamask();
    await metamask.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x" + chainId.toString(16),
          chainName:
            network === "mainnet"
              ? "Metis Andromeda Mainnet"
              : "Metis Stardust Testnet",
          nativeCurrency: {
            name: "Metis",
            symbol: "METIS",
            decimals: 18,
          },
          rpcUrls: [
            network === "mainnet"
              ? "https://andromeda.metis.io/?owner=1088"
              : "https://stardust.metis.io/?owner=588",
          ],
          blockExplorerUrls: [
            network === "mainnet"
              ? "https://andromeda-explorer.metis.io/"
              : "https://stardust-explorer.metis.io/",
          ],
        },
      ],
    });
  }, []);
}

/**
 * Switch the network in metamask.
 */
export function useSwitchNetwork() {
  return useCallback(async () => {
    const network = useAccount.getState().network;

    const chainId =
      network === "mainnet" ? config.MAINNET_CHAIN_ID : config.TESTNET_CHAIN_ID;

    const metamask = await getMetamask();
    await metamask.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    });
  }, []);
}
