import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { useAccount } from "store/account";
import { ReactNode, useCallback } from "react";
import MetamaskIcon from "components/MetamaskIcon";

type NavigationProps = {
  children: ReactNode;
};

export default function Navigation({ children }: NavigationProps) {
  const accountId = useAccount(useCallback((state) => state.accountId, []));

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
        {children}

        {accountId && (
          <Button
            sx={{
              position: "absolute",
              right: 24,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Box sx={{ width: 18, height: 18, mr: 2 }}>
              <MetamaskIcon />
            </Box>
            {accountId.substring(0, 6)}...
            {accountId.substring(accountId.length - 4)}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
