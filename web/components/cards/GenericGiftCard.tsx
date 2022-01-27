import { Box, Stack, Typography } from "@mui/material";
import { forwardRef, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useAccount } from "store/account";
import { formatAmount } from "utils/metis";

/**
 * The generated Gift Card which is then converted to an image when minting the NFT.
 */
export default forwardRef(function GenericGiftCard(_, ref) {
  const { control } = useFormContext();
  const message = useWatch({ control, name: "message" });
  const name = useWatch({ control, name: "name" });
  const amount = useWatch({ control, name: "amount" });
  const accountId = useAccount(useCallback((state) => state.accountId, []));

  return (
    <Stack
      ref={ref}
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 300,
        height: 400,
        boxShadow: 6,
        borderRadius: 2,
        bgcolor: "black",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 0, right: 0, width: "100%", p: 2 }}>
        <Typography variant="h6" color="white" textAlign="right">
          {formatAmount(amount)}
        </Typography>
      </Box>

      <Typography variant="h1">🎁</Typography>
      <Typography
        variant="h4"
        color="white"
        textAlign="center"
        sx={{ fontFamily: "'The Nautigal', cursive", px: 4 }}
      >
        {message}
      </Typography>

      <Box
        sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 2 }}
      >
        {name && (
          <>
            <Typography
              component="p"
              variant="caption"
              textAlign="center"
              color="grey.300"
            >
              With Love
            </Typography>
            <Typography
              variant="subtitle2"
              textAlign="center"
              color="white"
              sx={{ mt: -0.5 }}
            >
              {name}
            </Typography>
          </>
        )}
        <Typography
          color="grey.500"
          textAlign="center"
          sx={{ fontSize: ".5rem" }}
        >
          {accountId}
        </Typography>
      </Box>
    </Stack>
  );
});
