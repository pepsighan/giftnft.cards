import { grey } from '@mui/material/colors';
import { Grid, Paper, Typography } from '@mui/material';
import { formatWeiAmount } from 'utils/metis';
import { GiftCard } from 'store/gifts';
import { ethers } from 'ethers';

type UnwrapAmountProps = {
  txFee: ethers.BigNumber | null;
  giftCard: GiftCard;
  isMessage?: boolean;
};

export default function UnwrapAmount({
  giftCard,
  txFee,
  isMessage,
}: UnwrapAmountProps) {
  const withdrawAmount = txFee ? giftCard.amount.sub(txFee) : giftCard.amount;

  return (
    <>
      <Paper
        variant="outlined"
        elevation={0}
        sx={{ width: '100%', mt: 2, bgcolor: grey['100'] }}
      >
        <Grid container spacing={1} sx={{ p: 2 }}>
          <Grid item xs={8}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: 'right' }}
            >
              Amount:
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="body2"
              sx={{ textAlign: 'right', fontWeight: 'medium' }}
            >
              {formatWeiAmount(giftCard.amount.toString())}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: 'right' }}
            >
              Transaction Fee:
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="body2"
              sx={{ textAlign: 'right', fontWeight: 'medium' }}
            >
              -{formatWeiAmount(txFee?.toString())}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: 'right' }}
            >
              Withdraw Amount:
            </Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <Typography
              variant="body2"
              sx={{ textAlign: 'right', fontWeight: 'medium' }}
            >
              {formatWeiAmount(withdrawAmount.toString())}
            </Typography>
            {withdrawAmount.lte(0) && (
              <Typography variant="caption" color="error">
                Cannot withdraw
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {isMessage && (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          Actual transaction fee may differ based on various factors such as gas
          prices and gas limit.
        </Typography>
      )}
    </>
  );
}
