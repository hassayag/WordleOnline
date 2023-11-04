import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import './index.scss';

import MyRouter from './components/navigation/router';

const rootElem = document.getElementById('root');
if (rootElem) {
    const root = ReactDOM.createRoot(rootElem);
    root.render(
        <CookiesProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <MyRouter />
            </ThemeProvider>
        </CookiesProvider>
    );
}
