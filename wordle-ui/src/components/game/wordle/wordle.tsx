import React, { useState, useCallback, useEffect } from 'react';
import { Keyboard } from '../keyboard/keyboard';
import synthService from '@/services/synth-service';
import GameService from '@/services/game-service';

import config from '@/config/config';

import { Box } from '@mui/system';
import { Game, Letter } from '../types';
import GameEndModal from '../game-end-modal/game-end-modal';
import { parseRow } from './utils';
import { PlayerBoard } from '../player-info/player-info';
import { useSession } from '@/hooks/useSession';
import { useNavigate } from 'react-router-dom';

interface Props {
    game: Game;
    setGame: React.Dispatch<Game>;
    validGuesses: string[];
    sendGuess: (guess: { row: number; word: Letter[] }) => void;
    restartGame: () => void;
}

const Wordle = ({ game, setGame, validGuesses, sendGuess, restartGame }: Props) => {
    const [rowInd, setRowInd] = useState<number>(0);
    const [endModalOpen, setEndModalOpen] = useState<boolean>(false);

    // INIT
    useEffect(() => {
        const board = game.myState.board;

        for (let i = 0; i < Object.keys(board).length; i++) {
            if (board[i].length === 0) {
                setRowInd(i);
                break;
            }
        }
    }, []);

    const updateGameState = useCallback(() => {
        if (game.myState.isWon !== null) {
            return;
        }

        if (rowInd < 5) {
            setRowInd(rowInd + 1);
        }
    }, [game.myState.isWon, rowInd]);

    useEffect(() => {
        if (game.game_status === 'done') {
            setEndModalOpen(true);
        }
    }, [game.game_status]);

    const triggerError = useCallback(
        (rowInd: number) => {
            const newRows = Object.assign({}, game.myState.board);
            // reset the isError state so the css is reset
            newRows[rowInd].forEach((char) => (char.isError = false));

            newRows[rowInd].forEach((char) => (char.isError = true));
            setGame({ ...game, myState: { ...game.myState, board: newRows } });

            // wait for animation to finish and reset the error state
            setTimeout(() => {
                newRows[rowInd].forEach((char) => (char.isError = false));
                setGame({
                    ...game,
                    myState: { ...game.myState, board: newRows },
                });
            }, 300);
        },
        [game, setGame]
    );

    const wordIsValid = useCallback(
        (word: string) => {
            if (validGuesses.includes(word)) {
                return true;
            }

            return false;
        },
        [validGuesses]
    );

    const onKeyPress = useCallback(
        (key: string) => {
            // disable input if game is over
            if (game.myState.isWon !== null) {
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
            } else if (
                key === 'Enter' &&
                game.myState.board[rowInd].length === 5
            ) {
                if (config.feature_flags.synth) {
                    synthService.startLoop(
                        game.myState.board[rowInd].map(
                            (letter: Letter) => letter.key
                        )
                    );
                }
                const guess = game.myState.board[rowInd];
                sendGuess({ row: rowInd, word: guess });

                setTimeout(() => updateGameState(), 50);
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

            setGame({
                ...game,
                myState: { ...game.myState, board: newWordRows },
            });
        },
        [
            game,
            rowInd,
            sendGuess,
            setGame,
            triggerError,
            updateGameState,
            wordIsValid,
        ]
    );

    if (!game) {
        return <div> Retrieving purpose... </div>;
    }

    return (
        <>
            <Box>
                <PlayerBoard playerState={game.myState} isOpponent={false} />
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: '35%',
                }}
            >
                <Keyboard
                    keyStates={game.myState.letterStates}
                    onPress={onKeyPress}
                />
            </Box>
            <GameEndModal
                isWon={game.myState.isWon!!}
                isOpen={endModalOpen}
                goalWord={game.myState.goalWord}
                closeModal={() => setEndModalOpen(false)}
                restartGame={restartGame}
            />
        </>
    );
};

export default Wordle;
