import { Button, Container, Stack, Typography } from "@mui/material";
import { MdSwitchRight } from "react-icons/md";
import { useCallback } from "react";
import { useAccount } from "store/account";
import { useAddNetwork, useSwitchNetwork } from "store/chain";

export default function InvalidChain() {
  const network = useAccount(useCallback((state) => state.network, []));

  const onAddNetwork = useAddNetwork();
  const onSwitch = useSwitchNetwork();

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
