import React, { useState } from 'react';
import { Board, Keyboard } from '../../index';
import '../../index.scss';

export function Wordle() {
    // INITIALISE STATES

    // store the state of each letter
    const initLetterStates = {
        a: 'white',
        b: 'white',
        c: 'white',
        d: 'white',
        e: 'white',
        f: 'white',
        g: 'white',
        h: 'white',
        i: 'green',
        j: 'white',
        k: 'white',
        l: 'grey',
        m: 'green',
        n: 'yellow',
        o: 'white',
        p: 'white',
        q: 'white',
        r: 'white',
        s: 'white',
        t: 'white',
        u: 'white',
        v: 'white',
        w: 'white',
        x: 'white',
        y: 'white',
        z: 'white'
    },

        // the letters in each line of the word grid
        initWordRows = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        },

        // current row index
        initRowInd = 0;

    const [letterStates, setLetterStates] = useState(initLetterStates),
        [wordRows, setWordRows] = useState(initWordRows),
        [rowInd, setRowInd] = useState(initRowInd);

    // on keyboard input, update game state
    const onKeyPress = (key) => {
        // don't exceed word size of 5
        console.log(wordRows[rowInd]);

        // create copy and update specific row
        const newWordRows = Object.assign({}, wordRows);

        if (key === 'Backspace') {
            newWordRows[rowInd].pop();
        }

        if (wordRows[rowInd].length > 4) {
            return;
        }

        // check if input is a letter
        if (/^[a-zA-Z]$/.test(key)) {
            newWordRows[rowInd].push(key.toUpperCase());
        }

        setWordRows(newWordRows);
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board wordRows={wordRows} />
            </div>

            <div className="keyboard">
                <Keyboard keyStates={letterStates} onPress={onKeyPress} />
            </div>

            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>

        </div>
    );
}