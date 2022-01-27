import { Box, Button } from "@mui/material";
import { useCallback } from "react";
import MetamaskIcon from "components/MetamaskIcon";
import { useAsync } from "react-use";
import { getMetamask } from "utils/metamask";

export default function ConnectWallet() {
  const { value: metamask } = useAsync(useCallback(() => getMetamask(), []));

  const onRequest = useCallback(async () => {
    await metamask.request({ method: "eth_requestAccounts" });
  }, [metamask]);

  if (!metamask) {
    return (
      <Button
        component="a"
        href="https://metamask.io/"
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
      >
        Install Metamask
      </Button>
    );
  }

  return (
    <Button onClick={onRequest} variant="contained" size="large" sx={{ mt: 2 }}>
      <Box sx={{ width: 28, height: 28, mr: 2 }}>
        <MetamaskIcon />
      </Box>
      Connect your Wallet
    </Button>
  );
}
