import { Grid, Paper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { GiftCard } from 'store/gifts';
import { formatWeiAmount } from 'utils/metis';

type UnwrapAmountProps = {
  giftCard: GiftCard;
};

export default function UnwrapAmount({ giftCard }: UnwrapAmountProps) {
  const withdrawAmount = giftCard.amount;

  return (
    <>
      <Paper
        variant="outlined"
        elevation={0}
        sx={{ width: '100%', mt: 2, bgcolor: grey['100'] }}
      >
        <Grid container spacing={1} sx={{ p: 2 }}>
          <Grid item xs={8}>
            <Typography variant="body2" color="textSecondary">
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
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
