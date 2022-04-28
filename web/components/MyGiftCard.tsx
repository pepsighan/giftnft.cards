import { Box, Button } from '@mui/material';
import { GiftCard } from 'store/gifts';
import { useBoolean } from 'react-use';
import { useCallback } from 'react';
import UnwrapConfirmation from 'components/UnwrapConfirmation';

type MyGiftCardProps = {
  giftCard: GiftCard;
};

export default function MyGiftCard({ giftCard }: MyGiftCardProps) {
  const [open, toggle] = useBoolean(false);
  const onOpen = useCallback(() => toggle(true), [toggle]);
  const onClose = useCallback(() => toggle(false), [toggle]);

  return (
    <>
      <Box
        sx={{
          width: 300 / 1.2,
          height: 400 / 1.2,
          mb: 2,
          position: 'relative',
          cursor: !giftCard.isUnwrapped ? 'pointer' : 'inherit',
        }}
        onClick={!giftCard.isUnwrapped ? onOpen : undefined}
      >
        <Box
          component="img"
          src={giftCard.imageDataUrl}
          alt={giftCard.signedBy}
          sx={{ width: 300 / 1.2, height: 400 / 1.2 }}
        />

        {!giftCard.isUnwrapped && (
          <Button
            variant="contained"
            color="inherit"
            size="small"
            sx={{ position: 'absolute', left: 8, top: 8, opacity: 0.6 }}
            onClick={onOpen}
          >
            Unwrap Gift
          </Button>
        )}

        {giftCard.isUnwrapped && (
          <Button
            variant="contained"
            color="inherit"
            size="small"
            sx={{
              position: 'absolute',
              left: 8,
              top: 8,
              opacity: 0.6,
              '&.MuiButton-root.Mui-disabled': {
                color: 'grey.500',
                bgcolor: 'grey.300',
              },
            }}
            disabled
          >
            Unwrapped
          </Button>
        )}
      </Box>

      <UnwrapConfirmation giftCard={giftCard} open={open} onClose={onClose} />
    </>
  );
}
