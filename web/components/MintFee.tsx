import { Grid, Paper, Typography } from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";
import { formatAmount } from "utils/metis";

export default function MintFee() {
  const { control } = useFormContext();
  const amount = useWatch({ control, name: "amount" });

  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.100" }}>
      <Grid container>
        <Grid item xs={8}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: "right" }}
          >
            Mint Fee
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="body2"
            sx={{ textAlign: "right", fontWeight: "medium" }}
          >
            {formatAmount(amount || "0")}
          </Typography>
        </Grid>

        <Grid item xs={8}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: "right" }}
          >
            Total
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="body2"
            sx={{ textAlign: "right", fontWeight: "medium" }}
          >
            {formatAmount(amount || "0")}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
