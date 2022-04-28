import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import MyGiftCard from 'components/MyGiftCard';
import { useMyGifts } from 'store/gifts';

export default function MyGifts() {
  const { data: gifts, isLoading } = useMyGifts();

  return (
    <>
      <Typography variant="h5" textAlign="center" sx={{ mt: 4 }}>
        My Gifts
      </Typography>

      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        {isLoading && (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        )}

        {!isLoading && (gifts ?? []).length > 0 && (
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {(gifts ?? []).map((it) => (
              <Grid item key={it.tokenId._hex}>
                <MyGiftCard giftCard={it} />
              </Grid>
            ))}
          </Grid>
        )}

        {!isLoading && (gifts ?? []).length === 0 && (
          <Alert severity="info">You don&apos;t have any gifts yet.</Alert>
        )}
      </Container>
    </>
  );
}
