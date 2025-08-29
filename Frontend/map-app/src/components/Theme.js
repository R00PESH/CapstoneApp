// src/theme.js
import { createTheme } from '@mui/material/styles';

const doctorColor = "#00c3ad";
const providerColor = "#294fab";

const theme = createTheme({
  palette: {
    primary: { main: doctorColor, contrastText: "#fff" },
    secondary: { main: providerColor, contrastText: "#fff" },
    background: { default: "#f8fafc", paper: "#fff" },
    text: { primary: "#263238", secondary: "#666" },
    error: { main: "#d7263d" },
    success: { main: "#03C988" },
    warning: { main: "#FAE392" },
    info: { main: "#86A3B8" },
  },
  typography: {
    fontFamily: "Inter, 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeightBold: 700,
    button: { fontWeight: 700, letterSpacing: 0.8 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 20 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 700 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#f8fafc", // same as background.default
          color: "#263238", // same as text.primary
          borderRight: "1px solid #e0e0e0",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#00c3ad33", // semi-transparent primary
            color: doctorColor,
            "&:hover": {
              backgroundColor: "#00c3ad44",
            },
          },
          "&:hover": {
            backgroundColor: "#f0f7f7",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: providerColor,
        },
      },
    },
  },
});

export default theme;
