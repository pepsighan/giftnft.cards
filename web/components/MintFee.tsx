import { Grid, Paper, Typography } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { calculateMintFee, calculateWei, formatWeiAmount } from 'utils/metis';

export default function MintFee() {
  const { control } = useFormContext();
  const amountString = useWatch({ control, name: 'amount' });
  const amount = amountString ? calculateWei(amountString) : null;
  const mintFee = amount ? calculateMintFee(amount) : null;
  const total = mintFee ? amount!.plus(mintFee) : null;

  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
      <Grid container>
        <Grid item xs={8} sx={{ textAlign: 'right' }}>
          <Typography variant="body2" color="textSecondary">
            Mint Fee
          </Typography>
          <Typography variant="caption" color="textSecondary">
            (5% or 1 Metis whichever is lower)
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="body2"
            sx={{ textAlign: 'right', fontWeight: 'medium' }}
          >
            {formatWeiAmount(mintFee?.toString() ?? '0')}
          </Typography>
        </Grid>

        <Grid item xs={8}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: 'right' }}
          >
            Total
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="body2"
            sx={{ textAlign: 'right', fontWeight: 'medium' }}
          >
            {formatWeiAmount(total?.toString() ?? '0')}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
