import { Box, Stack, Typography } from "@mui/material";
import { forwardRef, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useAccount } from "store/account";
import { formatAmount } from "utils/metis";
import chineseNewYearSvg from "assets/chinese-new-year.svg";

export default forwardRef(function ChineseNewYear(_, ref) {
  const { control } = useFormContext();
  const message = useWatch({ control, name: "message" });
  const name = useWatch({ control, name: "name" });
  const amount = useWatch({ control, name: "amount" });
  const accountId = useAccount(useCallback((state) => state.accountId, []));

  return (
    <Stack
      ref={ref}
      alignItems="center"
      justifyContent="flex-end"
      sx={{
        width: 300,
        height: 400,
        boxShadow: 6,
        borderRadius: 2,
        bgcolor: "black",
        position: "relative",
        background: `url(${chineseNewYearSvg.src})`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="h6" color="white" textAlign="right">
          {formatAmount(amount)}
        </Typography>
      </Box>

      <Typography
        variant="h4"
        color="white"
        textAlign="center"
        sx={{ fontFamily: "'The Nautigal', cursive", px: 4 }}
      >
        {message}
      </Typography>

      <Box sx={{ width: "100%", p: 1 }}>
        {name && (
          <Typography
            variant="subtitle2"
            textAlign="center"
            color="white"
            sx={{ mt: -0.5 }}
          >
            {name}
          </Typography>
        )}
        <Typography
          color="grey.100"
          textAlign="center"
          sx={{ fontSize: ".5rem" }}
        >
          {accountId}
        </Typography>
      </Box>
    </Stack>
  );
});
