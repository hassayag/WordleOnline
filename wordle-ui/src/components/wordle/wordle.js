import React, { useState } from 'react';
import { ArrayUtils } from '../../utils/array'
import { Board, Keyboard } from '../../index';
import '../../index.scss';

export function Wordle(input) {
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
        i: 'white',
        j: 'white',
        k: 'white',
        l: 'white',
        m: 'white',
        n: 'white',
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
        [rowInd, setRowInd] = useState(initRowInd),
        [ gameIsWon, setGameIsWon ] = useState(null); 

    const updateGameState = () => {
        const newLetterStates = Object.assign({}, letterStates),
            newWordRows = Object.assign({}, wordRows),
            row = [],
            currentRowChars = wordRows[rowInd],
            goalWordChars= input.goalWord.split('');
        
        for (let i=0; i<currentRowChars.length; i++) {
            const char = currentRowChars[i];

            // can't downgrade a green keyboard key
            if (newLetterStates === 'green') {
                continue;
            }

            // find index of user's input character in the goal word
            const matchedInds = ArrayUtils.findAllInds(goalWordChars, char.key);

            // index == current index, perfect match
            if (matchedInds.includes(i)) {
                char.state = 'green';
                newLetterStates[char.key] = 'green';
            }
            // match not found, grey out key
            else if (matchedInds.length === 0) {
                char.state = 'grey';
                if (newLetterStates[char.key] === 'white') { // can't downgrade key state from green/yellow
                    newLetterStates[char.key] = 'grey';
                }
            }
            // if neither, it must be a partial match, so set as yellow
            else {
                char.state = 'yellow';
                if (newLetterStates[char.key] !== 'green') { // can't downgrade key state green
                    newLetterStates[char.key] = 'yellow';
                }
            }

            row.push(char);
        }
        
        newWordRows[rowInd] = row;

        setWordRows(newWordRows)
        setLetterStates(newLetterStates);
        
        // check for win
        if (currentRowChars.map(char => char.key).every((char, ind) => char === goalWordChars[ind])) {
            console.log('YOU WIN');
            setGameIsWon(1);
            return;
        }
        // check for loss
        if (rowInd === 5) {
            console.log('YOU LOSE');
            setGameIsWon(0);
            return;
        }
        // increment row
        else if (rowInd < 5) {
            setRowInd(rowInd + 1);
        }
    }

    // on keyboard input, update game state
    const onKeyPress = (key) => {
        // disable input if game is over
        if (gameIsWon !== null) {
            return;
        }

        // create copy and update specific row
        const newWordRows = Object.assign({}, wordRows);

        if (key === 'Backspace') {
            newWordRows[rowInd].pop();
        }
        else if (key === 'Enter' && wordRows[rowInd].length === 5){
            updateGameState();
        }
        
        // word length of 5
        if (wordRows[rowInd].length >= 5) {
            return;
        }

        // check if input is a letter
        if (/^[a-zA-Z]$/.test(key)) {
            newWordRows[rowInd].push({ key: key.toLowerCase(), state: 'white'});
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