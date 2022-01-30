import {
  AppBar,
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Toolbar,
} from "@mui/material";
import { useAccount } from "store/account";
import { ReactNode, useCallback } from "react";
import MetamaskIcon from "components/MetamaskIcon";
import { AiFillGithub } from "react-icons/ai";

type NavigationProps = {
  children: ReactNode;
};

export default function Navigation({ children }: NavigationProps) {
  const accountId = useAccount(useCallback((state) => state.accountId, []));
  const network = useAccount(useCallback((state) => state.network, []));

  const onNetworkChange = useCallback((ev) => {
    useAccount.setState({
      network: ev.target.value,
    });
  }, []);

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "grey.300",
      }}
    >
      <Toolbar sx={{ justifyContent: "center" }}>
        <Button
          component="a"
          href="https://github.com/pepsighan/giftnft.cards"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          sx={{
            position: "absolute",
            left: 24,
            display: { xs: "none", md: "flex" },
          }}
        >
          <Box sx={{ width: 18, height: 18, mr: 1 }}>
            <AiFillGithub size={18} />
          </Box>
          GitHub
        </Button>

        {children}

        {accountId && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              position: "absolute",
              right: 24,
            }}
          >
            <Select size="small" value={network} onChange={onNetworkChange}>
              <MenuItem value="mainnet">Andromeda Mainnet</MenuItem>
              <MenuItem value="testnet">Stardust Testnet</MenuItem>
            </Select>

            <Button
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              <Box sx={{ width: 18, height: 18, mr: 2 }}>
                <MetamaskIcon />
              </Box>
              {accountId.substring(0, 6)}...
              {accountId.substring(accountId.length - 4)}
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}
