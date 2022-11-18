import '../styles/globals.css'
import { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'

import { UIProvider } from '../context/ui';
import { EntriesProvider } from '../context/entries';

import { lightTheme } from '../themes';
import { SnackbarProvider } from 'notistack';



export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider maxSnack={2}>
      <EntriesProvider>
        <UIProvider>
          <ThemeProvider theme={ lightTheme }>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </UIProvider>
      </EntriesProvider>
    </SnackbarProvider>
  )
}
