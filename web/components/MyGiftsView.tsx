import Navigation from "components/Navigation";
import { Button, ButtonGroup } from "@mui/material";
import { useCallback } from "react";
import MyGifts from "components/MyGifts";
import { useAccount } from "store/account";
import config from "utils/config";
import InvalidChain from "components/InvalidChain";
import Link from "next/link";

export default function MyGiftsView() {
  const isValid = useAccount(
    useCallback(
      (state) =>
        [config.MAINNET_CHAIN_ID, config.TESTNET_CHAIN_ID].includes(
          state.chainId!
        ),
      []
    )
  );

  return (
    <>
      <Navigation>
        <ButtonGroup>
          <Link href="/" passHref>
            <Button component="a" variant="outlined">
              Mint a Gift Card
            </Button>
          </Link>
          <Link href="/my-gifts" passHref>
            <Button component="a" variant="contained">
              My Gift Cards
            </Button>
          </Link>
        </ButtonGroup>
      </Navigation>

      {isValid ? <MyGifts /> : <InvalidChain />}
    </>
  );
}
