import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './index.scss';
import Navbar from './components/home/home';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(_jsx(CookiesProvider, { children: _jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(BrowserRouter, { children: _jsx(Navbar, {}) })] }) }));
//# sourceMappingURL=App.js.map