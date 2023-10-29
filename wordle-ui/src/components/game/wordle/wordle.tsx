import React, { useState, useCallback, useEffect } from 'react';
import { Paper } from '@mui/material';
import { Board } from '../board/board';
import { Keyboard } from '../keyboard/keyboard';
import synthService from '@/services/synth-service';
import config from '@/config/config';

import './wordle.css';
import { Box } from '@mui/system';
import { Game, Letter } from '../types';
import GameEndModal from '../game-end-modal/game-end-modal';
import { parseRow } from './utils';

interface Props {
    game: Game,
    setGame: React.Dispatch<Game>,
    validGuesses: string[], 
    sendGuess: (guess: {row:number, word: Letter[]}) => void
}

const Wordle = ({game, setGame, validGuesses, sendGuess}: Props) => {   
    const [ gameIsWon, setGameIsWon ] = useState<boolean | null>(null);
    const [ rowInd, setRowInd ] = useState<number>(0);
    const [ endModalOpen, setEndModalOpen ] = useState<boolean>(false);

    // INIT
    useEffect(() =>{
        const board = game.myState.board;

        for (let i = 0; i < Object.keys(board).length; i++) {
            if (board[i].length === 0) {
                setRowInd(i);
                break;
            }
        }
    }, [])

    const updateGameState = useCallback(() => {
        const currentRowChars = game.myState.board[rowInd];
        const goalWordChars = game.myState.goalWord.split('')

        // check for win
        if (
            currentRowChars.length && 
            currentRowChars
                .map((char) => char.key)
                .every((char, ind) => char === goalWordChars[ind])
        ) {
            setGameIsWon(true);
            setEndModalOpen(true);
        }
        // check for loss
        else if (rowInd === 5) {
            setGameIsWon(false);
            setEndModalOpen(true);
        }
        else if (rowInd <5) {
            setRowInd(rowInd+1)
        }
    }, [game.myState.board, game.myState.goalWord, rowInd])

    const triggerError = useCallback((rowInd: number) => {
        const newRows = Object.assign({}, game.myState.board);

        newRows[rowInd].forEach((char) => (char.isError = true));
        setGame({...game, myState: { ...game.myState, board: newRows}});

        // wait for animation to finish and reset the error state
        setTimeout(() => {
            newRows[rowInd].forEach((char) => (char.isError = false));
            setGame({...game, myState: { ...game.myState, board: newRows}});
        }, 50);
    }, [game, setGame])

    const wordIsValid = useCallback((word: string) => {
        if (validGuesses.includes(word)) {
            return true;
        }

        return false;
    }, [validGuesses])

    const onKeyPress = useCallback((key: string) => {
        // disable input if game is over
        if (gameIsWon !== null) {
            return;
        }

        // create copy and update specific row
        const newWordRows = Object.assign({}, game.myState.board);

        if (key === 'Backspace') {
            newWordRows[rowInd].pop();
        } else if (
            key === 'Enter' &&
            game.myState.board[rowInd].length <= 5 &&
            !wordIsValid(parseRow(newWordRows[rowInd]))
        ) {
            triggerError(rowInd);
        } else if (key === 'Enter' && game.myState.board[rowInd].length === 5) {
            if (config.feature_flags.synth) {
                synthService.startLoop(
                    game.myState.board[rowInd].map(
                        (letter: Letter) => letter.key
                    )
                );
            }
            const guess = game.myState.board[rowInd];
            sendGuess({row: rowInd, word: guess})

            setTimeout(() => updateGameState(), 50)
        }

        // word length of 5
        if (game.myState.board[rowInd].length >= 5) {
            return;
        }

        // check if input is a letter
        if (/^[a-zA-Z]$/.test(key)) {
            newWordRows[rowInd].push({
                key: key.toLowerCase(),
                state: 'white',
            });
        }

        setGame({...game, myState: { ...game.myState, board: newWordRows}});
    }, [game, gameIsWon, rowInd, sendGuess, setGame, triggerError, updateGameState, wordIsValid]);


    if (!game) {
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
                    <Board state={game.myState} />
                    <Keyboard
                        keyStates={game.myState.letterStates}
                        onPress={onKeyPress}
                    />
                </Box>
            </Paper>
            <GameEndModal
                isWon={gameIsWon!!}
                isOpen={endModalOpen}
                goalWord={game.myState.goalWord}
                closeModal={() => setEndModalOpen(false)}
            />
        </>
    );

}

export default Wordle
