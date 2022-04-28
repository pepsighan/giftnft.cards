import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { NextSeo } from 'next-seo';
import theme from 'utils/theme';
import Head from 'next/head';
import { useAccount, useInitializeAccount } from 'store/account';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { useCallback, useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do not continuously fetch requests.
      staleTime: Infinity,
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  useInitializeAccount();

  const accountKey = useAccount(
    useCallback((state) => `${state.chainId}-${state.accountId}`, [])
  );

  // Reset all the fetched queries again when the account changes.
  useEffect(() => {
    queryClient.resetQueries();
  }, [accountKey]);

  return (
    <>
      <NextSeo
        title="Gift Card NFT"
        description="Mint a custom made gift card as an NFT to send it to your friends and family."
      />
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
