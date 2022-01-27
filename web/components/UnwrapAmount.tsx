import { grey } from "@mui/material/colors";
import { CardContent, Grid, Paper, Typography } from "@mui/material";
import { formatWeiAmount } from "utils/metis";
import { GiftCard } from "store/gifts";

type UnwrapAmountProps = {
  giftCard: GiftCard;
};

export default function UnwrapAmount({ giftCard }: UnwrapAmountProps) {
  return (
    <>
      <Paper
        variant="outlined"
        elevation={0}
        sx={{ width: "100%", mt: 2, bgcolor: grey["100"] }}
      >
        <Grid container spacing={1} sx={{ p: 2 }}>
          <Grid item xs={9.5}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: "right" }}
            >
              Amount:
            </Typography>
          </Grid>
          <Grid item xs={2.5}>
            <Typography
              variant="body2"
              sx={{ textAlign: "right", fontWeight: "medium" }}
            >
              {formatWeiAmount(giftCard.amount.toString())}
            </Typography>
          </Grid>

          <Grid item xs={9.5}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: "right" }}
            >
              Transaction Fee:
            </Typography>
          </Grid>
          <Grid item xs={2.5}>
            <Typography
              variant="body2"
              sx={{ textAlign: "right", fontWeight: "medium" }}
            >
              -{formatWeiAmount(giftCard.amount.toString())}
            </Typography>
          </Grid>

          <Grid item xs={9.5}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: "right" }}
            >
              Withdraw Amount:
            </Typography>
          </Grid>
          <Grid item xs={2.5}>
            <Typography
              variant="body2"
              sx={{ textAlign: "right", fontWeight: "medium" }}
            >
              {formatWeiAmount(giftCard.amount.toString())}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
        Actual transaction fee may differ based on various factors such as gas
        prices and gas limit.
      </Typography>
    </>
  );
}
