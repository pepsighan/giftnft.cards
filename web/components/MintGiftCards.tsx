import { Grid, Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { materialRegister } from "utils/materialForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMintGiftCard } from "store/gifts";
import { useSnackbar } from "notistack";
import html2canvas from "html2canvas";
import SentGifts from "components/SentGifts";
import RecipientTextField from "components/RecipientTextField";
import { useAsyncFn } from "react-use";
import GiftCard from "components/GiftCard";
import { calculateWei } from "utils/metis";
import MintFee from "components/MintFee";

const schema = z
  .object({
    message: z.string().min(1, "Required"),
    name: z.string().min(1, "Required"),
    amount: z.string().regex(/^([0-9]*[.])?[0-9]{0,9}$/, "Not a valid amount"),
    recipient: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  })
  .refine((data) => calculateWei(data.amount).gt(0), {
    message: "A gift card needs to have amount",
    path: ["amount"],
  });

type SchemaType = z.infer<typeof schema>;

export default function MintGiftCard() {
  const giftCardRef = useRef();

  const form = useForm({
    defaultValues: {
      message: "",
      name: "",
      amount: "1",
      recipient: "",
    },
    resolver: zodResolver(schema),
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = form;

  const { enqueueSnackbar } = useSnackbar();

  const mintGiftCard = useMintGiftCard();
  const [{ loading }, onMintGiftCard] = useAsyncFn(
    async (state: SchemaType) => {
      const canvas = await html2canvas(giftCardRef.current!, {
        width: 300,
        height: 400,
      });
      const imageDataUrl = canvas.toDataURL("image/webp");

      await mintGiftCard({
        signedBy: state.name,
        message: state.message,
        // Convert the amount to Wei.
        amount: calculateWei(state.amount).toString(),
        recipient: state.recipient,
        imageDataUrl,
      });
      reset();
      enqueueSnackbar("Minting a new gift card...", {
        variant: "success",
      });
    },
    [enqueueSnackbar, mintGiftCard, reset]
  );

  return (
    <>
      <Typography variant="h5" textAlign="center" sx={{ mt: 4 }}>
        Mint a Gift Card
      </Typography>

      <FormProvider {...form}>
        <Grid container spacing={8} sx={{ mt: 2 }}>
          <Grid item md={6}>
            <Stack alignItems="flex-end">
              <GiftCard ref={giftCardRef} />
            </Stack>
          </Grid>

          <Grid item md={6}>
            <Stack alignItems="flex-start">
              <Stack
                component="form"
                spacing={2}
                sx={{ width: 400 }}
                onSubmit={handleSubmit(onMintGiftCard)}
              >
                <RecipientTextField />
                <TextField
                  {...materialRegister(register, "amount")}
                  label="Amount"
                  fullWidth
                  helperText={errors.amount?.message}
                  error={!!errors.amount}
                />
                <MintFee />
                <TextField
                  {...materialRegister(register, "message")}
                  label="Message"
                  multiline
                  minRows={2}
                  fullWidth
                  helperText={errors.message?.message}
                  error={!!errors.message}
                />
                <TextField
                  {...materialRegister(register, "name")}
                  label="Your name"
                  fullWidth
                  helperText={errors.name?.message}
                  error={!!errors.name}
                />
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={loading}
                >
                  Mint your Gift
                </LoadingButton>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>

      <SentGifts />
    </>
  );
}
