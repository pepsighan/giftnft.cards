import { Button, Container, Stack, Typography } from "@mui/material";
import { MdSwitchRight } from "react-icons/md";
import { useCallback } from "react";
import { getMetamask } from "utils/metamask";
import { useAccount } from "store/account";
import config from "utils/config";

export default function InvalidChain() {
  const network = useAccount(useCallback((state) => state.network, []));

  const onAddNetwork = useCallback(async () => {
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
  }, [network]);

  const onSwitch = useCallback(async () => {
    const chainId =
      network === "mainnet" ? config.MAINNET_CHAIN_ID : config.TESTNET_CHAIN_ID;

    const metamask = await getMetamask();
    await metamask.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    });
  }, [network]);

  return (
    <Container
      sx={{
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MdSwitchRight size={80} />
      <Typography>
        You are not connected to Metis{" "}
        {network === "mainnet" ? "Andromeda Mainnet" : "Stardust Testnet"}.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={onAddNetwork}>
          Add Metis{" "}
          {network === "mainnet" ? "Andromeda Mainnet" : "Stardust Testnet"}
        </Button>
        <Button variant="contained" onClick={onSwitch}>
          Switch Network
        </Button>
      </Stack>
    </Container>
  );
}
