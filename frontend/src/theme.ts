import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A237E', // Um azul escuro e sóbrio
    },
    secondary: {
      main: '#FFC107', // Um amarelo vibrante para contraste
    },
    background: {
      default: '#F4F6F8', // Cinza claro para o fundo
      paper: '#FFFFFF',   // Branco para elementos de "papel"
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordas mais suaves
          boxShadow: '0px 4px 12px rgba(0,0,0,0.05)', // Sombra sutil
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Botões com texto normal
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
