import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useCallback, useRef, useState } from "react";
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
import { calculateMintFee, calculateWei, minGiftValue } from "utils/metis";
import MintFee from "components/MintFee";
import ChineseNewYearCard from "components/cards/ChineseNewYearCard";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import GenericGiftCard from "components/cards/GenericGiftCard";
import CupidCard from "components/cards/CupidCard";

const giftCards = [GenericGiftCard, ChineseNewYearCard, CupidCard];

const schema = z
  .object({
    message: z.string().min(1, "Required"),
    name: z.string().min(1, "Required"),
    amount: z.string().regex(/^([0-9]*[.])?[0-9]{0,9}$/, "Not a valid amount"),
    recipient: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  })
  .refine((data) => calculateWei(data.amount).gte(minGiftValue), {
    message: "A gift card needs to have at least 0.1 Metis",
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
      try {
        const canvas = await html2canvas(giftCardRef.current!, {
          width: 300,
          height: 400,
        });
        const imageDataUrl = canvas.toDataURL("image/webp");

        const giftAmount = calculateWei(state.amount);
        const mintFee = calculateMintFee(giftAmount);
        const totalAmount = giftAmount.plus(mintFee);

        await mintGiftCard({
          signedBy: state.name,
          message: state.message,
          amount: totalAmount.toString(),
          recipient: state.recipient,
          imageDataUrl,
        });
        reset();
        enqueueSnackbar("Successfully minted your gift card.", {
          variant: "success",
        });
      } catch (error: any) {
        enqueueSnackbar(error.data?.message || "Failed to mint a gift card.", {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, mintGiftCard, reset]
  );

  const [cardIndex, setCardIndex] = useState(0);
  const GiftCard = giftCards[cardIndex];

  const onNextCard = useCallback(
    () => setCardIndex((index) => (index + 1) % giftCards.length),
    []
  );
  const onPreviousCard = useCallback(
    () =>
      setCardIndex((index) => (index === 0 ? giftCards.length - 1 : index - 1)),
    []
  );

  return (
    <Container>
      <Typography
        variant="h5"
        textAlign="center"
        sx={{ mt: 4, mb: { xs: 2, md: 8 } }}
      >
        Mint a Gift Card
      </Typography>

      <FormProvider {...form}>
        <Grid container spacing={8} justifyContent="center">
          <Grid item md={6}>
            <Stack alignItems="flex-end">
              <Box>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <IconButton
                    onClick={onPreviousCard}
                    sx={{
                      transform: { xs: "rotateZ(90deg)", md: "rotateZ(0deg)" },
                    }}
                  >
                    <MdChevronLeft />
                  </IconButton>
                  <GiftCard ref={giftCardRef} />
                  <IconButton
                    onClick={onNextCard}
                    sx={{
                      transform: { xs: "rotateZ(90deg)", md: "rotateZ(0deg)" },
                    }}
                  >
                    <MdChevronRight />
                  </IconButton>
                </Stack>
                <Typography
                  textAlign="center"
                  sx={{ mt: 1, fontSize: "0.75rem", color: "grey.600" }}
                >
                  Select a gift card of your choosing.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item md={6}>
            <Stack alignItems="flex-start">
              <Stack
                component="form"
                spacing={2}
                sx={{ maxWidth: 400, width: "100%" }}
                onSubmit={handleSubmit(onMintGiftCard)}
              >
                <RecipientTextField />
                <TextField
                  {...materialRegister(register, "amount")}
                  label="Amount"
                  fullWidth
                  helperText={
                    errors.amount?.message ??
                    "This is the amount that will be stored in the gift card."
                  }
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
    </Container>
  );
}
