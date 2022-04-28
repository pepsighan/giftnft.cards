import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useSentGifts } from 'store/gifts';
import SentGiftCard from 'components/SentGiftCard';

export default function SentGifts() {
  const { data: gifts, isLoading } = useSentGifts();

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
        Gifts you sent
      </Typography>

      {isLoading && (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!isLoading && (gifts ?? []).length > 0 && (
        <Grid container spacing={4} justifyContent="center">
          {(gifts ?? []).map((it) => (
            <Grid item key={it.tokenId._hex}>
              <SentGiftCard giftCard={it} />
            </Grid>
          ))}
        </Grid>
      )}

      {!isLoading && (gifts ?? []).length === 0 && (
        <Alert severity="info">You have not sent any gifts.</Alert>
      )}
    </Container>
  );
}
