import { Box, Button, Stack, Typography } from '@mui/material';
import { AiFillGithub } from 'react-icons/ai';

export default function Footer() {
  return (
    <Stack alignItems="center" sx={{ p: 2 }}>
      <Typography variant="body2" textAlign="center" color="textSecondary">
        If you have any requests or issues, contact us via
      </Typography>
      <Button
        component="a"
        href="https://github.com/pepsighan/giftnft.cards"
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
      >
        <Box sx={{ width: 18, height: 18, mr: 1 }}>
          <AiFillGithub size={18} />
        </Box>
        GitHub
      </Button>
    </Stack>
  );
}
