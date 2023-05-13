import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from "react-cookie";

import {CssBaseline} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'

import './index.scss';

import Navbar from './components/home/home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CookiesProvider>
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
        </ThemeProvider>
    </CookiesProvider>
);
