import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from "react-cookie";

import './index.scss';

import Navbar from './components/home/home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CookiesProvider>
        <BrowserRouter>
            <Navbar />
        </BrowserRouter>
    </CookiesProvider>
);
