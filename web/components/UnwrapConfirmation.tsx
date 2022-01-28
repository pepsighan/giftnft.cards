import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { GiftCard, useUnwrapFee, useUnwrapGift } from "store/gifts";
import { useAsyncFn } from "react-use";
import { LoadingButton } from "@mui/lab";
import UnwrapAmount from "components/UnwrapAmount";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";

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
  const unwrapGift = useUnwrapGift();
  const { enqueueSnackbar } = useSnackbar();

  const [{ loading }, onUnwrap] = useAsyncFn(async () => {
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

          <UnwrapAmount
            giftCard={giftCard}
            txFee={txFee ? ethers.BigNumber.from(txFee) : null}
          />

          <Typography variant="body2" sx={{ mt: 1 }}>
            You will be prompted to sign a message to authorize the unwrap
            request.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <LoadingButton
          variant="contained"
          onClick={onUnwrap}
          loading={loading || unwrapFeeLoading}
          disabled={!isUnwrappable || withdrawAmount.lte(0)}
        >
          {isUnwrappable ? "Unwrap" : "Unwrap Not Available"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
