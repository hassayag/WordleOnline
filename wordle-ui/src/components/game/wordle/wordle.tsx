import React from 'react';
import { Paper } from '@mui/material';
import { Board } from '../board/board';
import { Keyboard } from '../keyboard/keyboard';
import synthService from '@/services/synth-service';
import config from '@/config/config';

import './wordle.css';
import { Box } from '@mui/system';
import { Game, Letter, PlayerState } from '../types';
import GameEndModal from '../game-end-modal/game-end-modal';

interface State {
    _letterStates: PlayerState['letterStates'];
    _wordRows: PlayerState['board'];
    _rowInd: number;
    _gameIsWon: boolean | null;
    _endModalOpen: boolean;
}

export class Wordle extends React.Component<
    { game: Game; validGuesses: string[], sendGuess: (guess: {row:number, word: Letter[]}) => void },
    State
> {
    private gameIsLoaded = false;
    private gameState: PlayerState;
    private goalWord: string;

    constructor(props: { game: Game; validGuesses: string[], sendGuess:  (guess: {row:number, word: Letter[]}) => void }) {
        super(props);

        // TODO hit endpoint to get player state
        this.gameState = props.game.myState;
        this.goalWord = this.gameState.goalWord;
    }

    async componentDidMount() {
        const initLetterStates = this.gameState.letterStates;

        // the letters in each line of the word grid
        const initWordRows = this.gameState.board;

        // row index
        let initRowInd = 0;

        for (let i = 0; i < Object.keys(initWordRows).length; i++) {
            if (initWordRows[i].length === 0) {
                initRowInd = i;
                break;
            }
        }

        // init state
        this.setState({
            _letterStates: initLetterStates,
            _wordRows: initWordRows,
            _rowInd: initRowInd,
            _gameIsWon: null,
            _endModalOpen: false || this.props.game.game_status === 'done',
        });

        this.gameIsLoaded = true;
    }
    render() {
        if (!this.gameIsLoaded) {
            return <div> Retrieving purpose... </div>;
        }

        return (
            <>
                <Paper elevation={10}>
                    <Box
                        sx={{
                            width: 600,
                            marginTop: 8,
                            marginBottom: 8,
                            display: 'flex',
                            gap: '80px',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Board state={this.gameState} />
                        <Keyboard
                            keyStates={this.letterStates}
                            onPress={this.onKeyPress}
                        />
                    </Box>
                </Paper>
                <GameEndModal
                    isWon={this.gameIsWon!!}
                    isOpen={this.endModalOpen}
                    goalWord={this.goalWord}
                    closeModal={() => this.setEndModalOpen(false)}
                />
            </>
        );
    }

    onKeyPress = (key: string) => {
        // disable input if game is over
        if (this.gameIsWon !== null) {
            return;
        }

        // create copy and update specific row
        const newWordRows = Object.assign({}, this.wordRows);

        if (key === 'Backspace') {
            newWordRows[this.rowInd].pop();
        } else if (
            key === 'Enter' &&
            this.wordRows[this.rowInd].length <= 5 &&
            !this._wordIsValid(this._parseRow(newWordRows[this.rowInd]))
        ) {
            this._triggerError(this.rowInd);
        } else if (key === 'Enter' && this.wordRows[this.rowInd].length === 5) {
            if (config.feature_flags.synth) {
                synthService.startLoop(
                    this.wordRows[this.rowInd].map(
                        (letter: Letter) => letter.key
                    )
                );
            }
            const guess = this.wordRows[this.rowInd];
            this.props.sendGuess({row: this.rowInd, word: guess})
        }

        // word length of 5
        if (this.wordRows[this.rowInd].length >= 5) {
            return;
        }

        // check if input is a letter
        if (/^[a-zA-Z]$/.test(key)) {
            newWordRows[this.rowInd].push({
                key: key.toLowerCase(),
                state: 'white',
            });
        }

        this.wordRows = newWordRows;
    };

    _updateGameState() {
        const currentRowChars = this.wordRows[this.rowInd];
        const goalWordChars = this.goalWord.split('')

        // check for win
        if (
            currentRowChars
                .map((char) => char.key)
                .every((char, ind) => char === goalWordChars[ind])
        ) {
            this.gameIsWon = true;
            this.setEndModalOpen(true);
        }
        // check for loss
        else if (this.rowInd === 5) {
            this.gameIsWon = false;
            this.setEndModalOpen(true);
        }
        // increment row
        else if (this.rowInd < 5) {
            this.rowInd = this.rowInd + 1;
        }
    }

    _triggerError(rowInd: number) {
        const newRows = Object.assign({}, this.wordRows);

        newRows[rowInd].forEach((char) => (char.isError = true));
        this.wordRows = newRows;

        // wait for animation to finish and reset the error state
        setTimeout(() => {
            newRows[rowInd].forEach((char) => (char.isError = false));
            this.wordRows = newRows;
        }, 50);
    }

    _parseRow(rowObj: Letter[]) {
        const letters = Object.values(rowObj).map((obj) => obj.key);

        return letters.join('');
    }

    _wordIsValid(word: string) {
        if (this.props.validGuesses.includes(word)) {
            return true;
        }

        return false;
    }

    get letterStates() {
        return this.state._letterStates;
    }
    get wordRows() {
        return this.state._wordRows;
    }
    get rowInd() {
        return this.state._rowInd;
    }
    get gameIsWon() {
        return this.state._gameIsWon;
    }
    get endModalOpen() {
        return this.state._endModalOpen;
    }

    set letterStates(val) {
        this.setState(Object.assign(this.state, { _letterStates: val }));
    }
    set wordRows(val) {
        this.setState(Object.assign(this.state, { _wordRows: val }));
    }
    set rowInd(val) {
        this.setState(Object.assign(this.state, { _rowInd: val }));
    }
    set gameIsWon(val) {
        this.setState(Object.assign(this.state, { _gameIsWon: val }));
    }

    setEndModalOpen(val: boolean) {
        this.setState(Object.assign(this.state, { _endModalOpen: val }));
    }
}
