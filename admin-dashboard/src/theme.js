import { createTheme } from '@mui/material/styles'

export const getAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#1B5E20',
      },
      secondary: {
        main: '#FFC107',
      },
      background: {
        default: mode === 'dark' ? '#0b1410' : '#f1f5f2',
        paper: mode === 'dark' ? '#121b16' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#e6f4e8' : '#1a2021',
        secondary: mode === 'dark' ? '#c8d7c5' : '#4d5762',
      },
    },
    typography: {
      fontFamily: ['Inter', 'Roboto', 'sans-serif'].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  })
