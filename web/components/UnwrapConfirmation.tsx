import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import {
  GiftCard,
  useUnwrapFee,
  useUnwrapGift,
  useUnwrapGiftBySelf,
} from "store/gifts";
import { useAsyncFn } from "react-use";
import { LoadingButton } from "@mui/lab";
import UnwrapAmount from "components/UnwrapAmount";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";

type UnwrapConfirmationProps = {
  giftCard: GiftCard;
  open: boolean;
  onClose: () => void;
};

export default function UnwrapConfirmation({
  giftCard,
  open,
  onClose,
}: UnwrapConfirmationProps) {
  const [isGasless, setIsGasless] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const unwrapGiftBySelf = useUnwrapGiftBySelf();
  const [{ loading: unwrappingSelf }, onUnwrapGiftBySelf] =
    useAsyncFn(async () => {
      try {
        await unwrapGiftBySelf(giftCard.tokenId.toString());
        enqueueSnackbar("Unwrapping your gift card...", {
          variant: "success",
        });
        onClose();
      } catch (error: any) {
        enqueueSnackbar(
          error.data?.message || "Failed to unwrap your gift card.",
          {
            variant: "error",
          }
        );
      }
    }, [giftCard.tokenId, unwrapGiftBySelf]);

  const unwrapGift = useUnwrapGift();
  const [{ loading: unwrapping }, onGaslessUnwrap] = useAsyncFn(async () => {
    try {
      await unwrapGift(giftCard.tokenId.toString());
      enqueueSnackbar("Unwrapping your gift card...", {
        variant: "success",
      });
      onClose();
    } catch (error: any) {
      enqueueSnackbar(
        error.data?.message || "Failed to unwrap your gift card.",
        {
          variant: "error",
        }
      );
    }
  }, [giftCard.tokenId, unwrapGift]);

  const { data, isLoading: unwrapFeeLoading } = useUnwrapFee(
    giftCard.tokenId.toString(),
    open
  );
  const txFee = data?.txFee;
  const isUnwrappable = data?.isUnwrappable;
  const withdrawAmount = txFee ? giftCard.amount.sub(txFee) : giftCard.amount;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Stack alignItems="center">
          <Box
            component="img"
            src={giftCard.imageDataUrl}
            alt={giftCard.signedBy}
            sx={{ width: 300 / 2, height: 400 / 2, mb: 2 }}
          />

          <Typography variant="h6">Unwrap Gift Card</Typography>
          <Typography textAlign="center" color="textSecondary">
            Unwrapping will withdraw the amount stored in the gift card into
            your account.
          </Typography>

          <ButtonGroup sx={{ mt: 2 }}>
            <Button
              variant={isGasless ? "contained" : "outlined"}
              onClick={useCallback(() => setIsGasless(true), [])}
            >
              Gas-less Unwrap
            </Button>
            <Button
              variant={!isGasless ? "contained" : "outlined"}
              onClick={useCallback(() => setIsGasless(false), [])}
            >
              Normal Unwrap
            </Button>
          </ButtonGroup>

          {isGasless && (
            <>
              <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                You can unwrap your gift by paying the transaction fees with the
                gift card itself.
              </Typography>

              <UnwrapAmount
                giftCard={giftCard}
                txFee={txFee ? ethers.BigNumber.from(txFee) : null}
                isMessage
              />

              <Typography variant="body2" sx={{ mt: 1 }}>
                You will be prompted to sign a message to authorize the unwrap
                request.
              </Typography>
            </>
          )}

          {!isGasless && (
            <>
              <Typography variant="body2" sx={{ mt: 2 }}>
                You can unwrap the gift by running the transaction using your
                wallet.
              </Typography>

              <UnwrapAmount
                giftCard={giftCard}
                txFee={ethers.BigNumber.from(0)}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        {isGasless && (
          <LoadingButton
            variant="contained"
            onClick={onGaslessUnwrap}
            loading={unwrapping || unwrapFeeLoading}
            disabled={!isUnwrappable || withdrawAmount.lte(0)}
          >
            {isUnwrappable ? "Unwrap" : "Unwrap Not Available"}
          </LoadingButton>
        )}

        {!isGasless && (
          <LoadingButton
            variant="contained"
            onClick={onUnwrapGiftBySelf}
            loading={unwrappingSelf}
          >
            Unwrap
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
