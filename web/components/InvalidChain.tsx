import { Button, Container, Typography } from "@mui/material";
import { MdSwitchRight } from "react-icons/md";
import { useCallback } from "react";
import { getMetamask } from "utils/metamask";
import { useAccount } from "store/account";
import config from "utils/config";

export default function InvalidChain() {
  const onSwitch = useCallback(async () => {
    const network = useAccount.getState().network;
    const chainId =
      network === "mainnet" ? config.MAINNET_CHAIN_ID : config.TESTNET_CHAIN_ID;

    const metamask = await getMetamask();
    await metamask.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    });
  }, []);

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
      <Typography>You are not connected to Metis Blockchain.</Typography>
      <Button variant="contained" sx={{ mt: 4 }} onClick={onSwitch}>
        Switch Network
      </Button>
    </Container>
  );
}
