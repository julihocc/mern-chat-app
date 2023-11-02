// frontend\src\theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // Explicitly set the mode to 'light'
    primary: {
      main: "#075E54", // WhatsApp green
    },
    secondary: {
      main: "#128C7E", // WhatsApp light green
    },
    error: {
      main: "#d80000", // Generic error color
    },
    background: {
      default: "#ECE5DD", // WhatsApp chat background color
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif', // Closest free font to WhatsApp's custom San Francisco font
    fontSize: 14,
    button: {
      textTransform: "none",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
