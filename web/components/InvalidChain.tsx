import {
  Button,
  Container,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { MdSwitchRight } from 'react-icons/md';
import { useCallback } from 'react';
import { useAccount } from 'store/account';
import { useAddNetwork, useSwitchNetwork } from 'store/chain';

export default function InvalidChain() {
  const network = useAccount(useCallback((state) => state.network, []));

  const onAddNetwork = useAddNetwork();
  const onSwitch = useSwitchNetwork();

  const networkName =
    network === 'mainnet' ? 'Andromeda Mainnet' : 'Stardust Testnet';

  return (
    <Container
      sx={{
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MdSwitchRight size={80} />
      <Typography textAlign="center">
        You are not connected to Metis {networkName}.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={onAddNetwork}>
          Add Metis {networkName}
        </Button>
        <Button variant="contained" onClick={onSwitch}>
          Switch Network
        </Button>
      </Stack>

      <Paper
        variant="outlined"
        sx={{ p: 3, mt: 4, maxWidth: 500, bgcolor: 'grey.50' }}
      >
        <Typography variant="body2" textAlign="center">
          If you have not added Metis {networkName} to your Metamask, you can do
          so by clicking on <b>Add Metis {networkName}</b> button.
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          Or you may choose to add the network on{' '}
          <Link
            href="https://chainlist.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            chainlist.org
          </Link>
          .
        </Typography>
      </Paper>
    </Container>
  );
}
