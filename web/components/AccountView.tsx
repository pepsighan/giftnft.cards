import MintGiftCard from "components/MintGiftCards";
import Navigation from "components/Navigation";
import { Button, ButtonGroup } from "@mui/material";
import { useCallback, useState } from "react";
import MyGifts from "components/MyGifts";
import { useAccount } from "store/account";
import config from "utils/config";
import InvalidChain from "components/InvalidChain";

export default function AccountView() {
  const [tabIndex, setTabIndex] = useState(0);
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
          <Button
            variant={tabIndex === 0 ? "contained" : "outlined"}
            onClick={useCallback(() => setTabIndex(0), [])}
          >
            Mint a Gift Card
          </Button>
          <Button
            variant={tabIndex === 1 ? "contained" : "outlined"}
            onClick={useCallback(() => setTabIndex(1), [])}
          >
            My Gift Cards
          </Button>
        </ButtonGroup>
      </Navigation>

      {isValid && <>{tabIndex === 0 ? <MintGiftCard /> : <MyGifts />}</>}
      {!isValid && <InvalidChain />}
    </>
  );
}
