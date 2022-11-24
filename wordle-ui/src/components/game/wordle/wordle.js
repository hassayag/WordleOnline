import React from 'react';
import { ArrayUtils } from '../../../utils/array'

import { Board, Keyboard, WordService } from '../../../index';
import '../../../index.scss';

export class Wordle extends React.Component {
    constructor(goalWord) {
        super();

        this._wordService = new WordService();

        this._goalWord = goalWord;
        
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
            _gameIsWon: null            
        };
    }
 
    async componentDidMount(){
        const words = await this._wordService.getWords();
        console.log(words)
    }

    render() {
        return <div className="game">
            <div className="game-board">
                <Board wordRows={this.wordRows} />
            </div>

            <div className="keyboard">
                <Keyboard keyStates={this.letterStates} onPress={this.onKeyPress} />
            </div>

            <div className="game-info">
                <div>{
                    this.gameIsWon ? 
                        this.gameIsWon === 0 ? 'You Lose!' : 'You Win!'
                        :
                        ''
                    }
                </div>
            </div>
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
        else if (key === 'Enter' && this.wordRows[this.rowInd].length === 5){
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
            goalWordChars= this._goalWord.goalWord.split('');
        
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
            console.log('YOU WIN');
            this.gameIsWon = 1;
            return;
        }
        // check for loss
        if (this.rowInd === 5) {
            console.log('YOU LOSE');
            this.gameIsWon = 0;
            return;
        }
        // increment row
        else if (this.rowInd < 5) {
            this.rowInd = this.rowInd + 1;
        }
    }


    get letterStates() { return this.state._letterStates }
    get wordRows() { return this.state._wordRows }
    get rowInd() { return this.state._rowInd }
    get gameIsWon() { return this.state._gameIsWon }
    
    set letterStates(val) { this.setState(Object.assign(this.state, { _letterStates: val })) }
    set wordRows(val) { this.setState(Object.assign(this.state, { _wordRows: val })) }
    set rowInd(val) { this.setState(Object.assign(this.state, { _rowInd: val })) }
    set gameIsWon(val) { this.setState(Object.assign(this.state, { _gameIsWon: val })) }
}