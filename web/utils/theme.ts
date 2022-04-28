import { createTheme } from '@mui/material';
import { indigo } from '@mui/material/colors';

export default createTheme({
  palette: {
    primary: indigo,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'initial',
          borderRadius: 20,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
    },
  },
});
