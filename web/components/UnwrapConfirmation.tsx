import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import UnwrapAmount from 'components/UnwrapAmount';
import { useSnackbar } from 'notistack';
import { useAsyncFn } from 'react-use';
import { GiftCard, useUnwrapGiftBySelf } from 'store/gifts';

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
  const { enqueueSnackbar } = useSnackbar();

  const unwrapGiftBySelf = useUnwrapGiftBySelf();
  const [{ loading: unwrappingSelf }, onUnwrapGiftBySelf] =
    useAsyncFn(async () => {
      try {
        await unwrapGiftBySelf(giftCard.tokenId.toString());
        enqueueSnackbar('Unwrapping your gift card...', {
          variant: 'success',
        });
        onClose();
      } catch (error: any) {
        enqueueSnackbar(
          error.data?.message || 'Failed to unwrap your gift card.',
          {
            variant: 'error',
          }
        );
      }
    }, [giftCard.tokenId, unwrapGiftBySelf]);

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

          <UnwrapAmount giftCard={giftCard} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <LoadingButton
          variant="contained"
          onClick={onUnwrapGiftBySelf}
          loading={unwrappingSelf}
        >
          Unwrap
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
