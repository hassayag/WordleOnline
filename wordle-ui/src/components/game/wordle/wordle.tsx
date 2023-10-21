import React from 'react';
import { ArrayUtils } from '@/utils/array';
import { Button, Modal, Paper, Typography } from '@mui/material';
import { Board } from '../board/board';
import { Keyboard } from '../keyboard/keyboard';
import GameService from '@/services/game-service';
import synthService from '@/services/synth-service';
import config from '@/config/config'

import './wordle.css';
import { Box } from '@mui/system';
import { Game, Letter, PlayerState } from '../types';

interface State {
    _letterStates: PlayerState['letterStates'],
    _wordRows: PlayerState['board'],
    _rowInd: number,
    _gameIsWon: boolean | null,
    _endModalOpen: boolean
}

export class Wordle extends React.Component<{game: Game, validGuesses: string[]}, State> {
    private gameIsLoaded = false;
    private gameState: PlayerState;
    private goalWord: string

    constructor(props: {game: Game, validGuesses: string[]}) {
        super(props);
        
        // TODO hit endpoint to get player state
        this.gameState = props.game.state[0];
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

                <Modal
                    open={this.endModalOpen}
                    onClose={() => this.setEndModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'gray',
                            border: '2px',
                            boxShadow: 24,
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            outline: 0,
                        }}
                    >
                        <Typography id="modal-modal-title">
                            {this.gameIsWon
                                ? 'You have won!'
                                : `You have lost :(      The word was "${this.goalWord}"`}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {/* Play again? */}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 2,
                            }}
                        >
                            <Button
                                sx={{
                                    position: 'absolute',
                                    bottom: 4,
                                    left: 4,
                                }}
                                variant="contained"
                                color="secondary"
                                onClick={() => this.setEndModalOpen(false)}
                            >
                                Close
                            </Button>
                            <Button
                                sx={{
                                    position: 'absolute',
                                    bottom: 4,
                                    right: 4,
                                }}
                                variant="contained"
                                color="primary"
                                onClick={() => this.setEndModalOpen(false)}
                            >
                                Play Again
                            </Button>
                        </Box>
                    </Box>
                </Modal>
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
                synthService.startLoop(this.wordRows[this.rowInd].map((letter: Letter) => letter.key))
            }
            this._updateGameState();
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
        const newLetterStates = Object.assign({}, this.letterStates),
            newWordRows = Object.assign({}, this.wordRows),
            row = [],
            currentRowChars = this.wordRows[this.rowInd],
            goalWordChars = this.goalWord.split('');

        for (let i = 0; i < currentRowChars.length; i++) {
            const char = currentRowChars[i];

            // can't downgrade a green keyboard key
            if (newLetterStates[char.key] === 'green') {
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
                if (newLetterStates[char.key] === 'white') {
                    // can't downgrade key state from green/yellow
                    newLetterStates[char.key] = 'grey';
                }
            }
            // if neither, it must be a partial match, so set as yellow
            else {
                char.state = 'yellow';
                if (newLetterStates[char.key] !== 'green') {
                    // can't downgrade key state green
                    newLetterStates[char.key] = 'yellow';
                }
            }

            row.push(char);
        }

        newWordRows[this.rowInd] = row;

        // update state
        this.wordRows = newWordRows;
        this.letterStates = newLetterStates;

        // send request to update db
        const game = Object.assign({}, this.props.game);
        game.state[0].board = this.wordRows;
        game.state[0].letterStates = this.letterStates;

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

        if (this.gameIsWon !== null) {
            game.game_status = 'done';
        }

        GameService.updateGame(game.uuid, game.game_status, game.state[0]);
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
