import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';

// importing directly here because calling index.js would be circularish
import { Wordle } from './components/game/wordle/wordle';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Wordle goalWord='poopy'/>);

 