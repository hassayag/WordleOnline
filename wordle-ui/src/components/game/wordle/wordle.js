import React from 'react';
import { ArrayUtils } from '../../../utils/array'

import { Board } from '../board/board';
import { Keyboard } from '../keyboard/keyboard';
import GameEndModal from './game-end-modal/game-end-modal';
import '../../../index.scss';

export class Wordle extends React.Component {
    constructor() {
        super();
        
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

        // row index
        initRowInd = 0;
        
        // init state
        this.state = {
            _letterStates: initLetterStates,
            _wordRows: initWordRows,
            _rowInd: initRowInd,
            _gameIsWon: null,
            _endModalOpen: false            
        };
    }

    render() {
        if (!this.props.goalWord) {
            return <div> Retrieving purpose... </div>;
        }
        
        return <div className="game">
            <div>
                <Board wordRows={this.wordRows} />
            </div>

            <div>
                <Keyboard keyStates={this.letterStates} onPress={this.onKeyPress} />
            </div>
    
            {this.endModalOpen && 
                <GameEndModal 
                    isWon={this.gameIsWon} 
                    goalWord={this.props.goalWord} 
                    closeModal={() => this.setEndModalOpen(false)} 
            />} 
        </div>
    }

    onKeyPress = (key) => {
        // disable input if game is over
        if (this.gameIsWon !== null) {
            return;
        }

        // create copy and update specific row
        const newWordRows = Object.assign({}, this.wordRows);

        if (key === 'Backspace') {
            newWordRows[this.rowInd].pop();
        }
        else if (key === 'Enter' && this.wordRows[this.rowInd].length <= 5 && !this._wordIsValid(this._parseRow(newWordRows[this.rowInd]))) {
            this._triggerError(this.rowInd);
        }
        else if (key === 'Enter' && this.wordRows[this.rowInd].length === 5) {
            this._updateGameState();
        }
        
        // word length of 5
        if (this.wordRows[this.rowInd].length >= 5) {
            return;
        }

        // check if input is a letter
        if (/^[a-zA-Z]$/.test(key)) {
            newWordRows[this.rowInd].push({ key: key.toLowerCase(), state: 'white'});
        }

        this.wordRows = newWordRows;
    }

    _updateGameState() {
        const newLetterStates = Object.assign({}, this.letterStates),
            newWordRows = Object.assign({}, this.wordRows),
            row = [],
            currentRowChars = this.wordRows[this.rowInd],
            goalWordChars= this.props.goalWord.split('');
        
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
    
        newWordRows[this.rowInd] = row;
        
        // update state
        this.wordRows = newWordRows;
        this.letterStates = newLetterStates;
        
        // check for win
        if (currentRowChars.map(char => char.key).every((char, ind) => char === goalWordChars[ind])) {
            this.gameIsWon = 1;
            this.setEndModalOpen(true);
            return;
        }
        // check for loss
        if (this.rowInd === 5) {
            this.gameIsWon = 0;
            this.setEndModalOpen(true);
            return;
        }
        // increment row
        else if (this.rowInd < 5) {
            this.rowInd = this.rowInd + 1;
        }
    }

    _triggerError(rowInd) {
        const newRows = Object.assign({}, this.wordRows);

        newRows[rowInd].forEach(char => char.isError = true);
        this.wordRows = newRows;

        // wait for animation to finish and reset the error state
        setTimeout(() => {
            newRows[rowInd].forEach(char => char.isError = false);
            this.wordRows = newRows;
        }, 50);
    }

    _parseRow(rowObj) {
        const letters = Object.values(rowObj).map(obj => obj.key);

        return letters.join('');
    }

    _wordIsValid(word) {
        console.log(word);
        if (this.props.validGuesses.includes(word)) {
            return true;
        }

        return false
    }


    get letterStates() { return this.state._letterStates }
    get wordRows() { return this.state._wordRows }
    get rowInd() { return this.state._rowInd }
    get gameIsWon() { return this.state._gameIsWon }
    get endModalOpen() { return this.state._endModalOpen }

    set letterStates(val) { this.setState(Object.assign(this.state, { _letterStates: val })) }
    set wordRows(val) { this.setState(Object.assign(this.state, { _wordRows: val })) }
    set rowInd(val) { this.setState(Object.assign(this.state, { _rowInd: val })) }
    set gameIsWon(val) { this.setState(Object.assign(this.state, { _gameIsWon: val })) }

    setEndModalOpen(val) { this.setState(Object.assign(this.state, { _endModalOpen: val })) }
}