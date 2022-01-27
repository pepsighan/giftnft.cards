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
  const [{ loading }, onUnwrap] = useAsyncFn(async () => {
    await unwrapGift(giftCard.tokenId.toString());
    onClose();
  }, [giftCard.tokenId, unwrapGift]);

  const { data } = useUnwrapFee(giftCard.tokenId.toString(), open);
  const txFee = data?.txFee;
  const isUnwrappable = data?.isUnwrappable;

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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <LoadingButton
          variant="contained"
          onClick={onUnwrap}
          loading={loading}
          disabled={!isUnwrappable}
        >
          Unwrap
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
