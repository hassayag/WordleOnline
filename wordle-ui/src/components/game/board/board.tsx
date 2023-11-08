import React, { useEffect, useState } from 'react';
import { Fade, Paper, Typography } from '@mui/material';
import './board.scss';
import { PlayerState, Letter } from '../types';

const Board = ({
    playerState,
    isOpponent,
}: {
    playerState: PlayerState;
    isOpponent: boolean;
}) => {
    const renderGrid = () => {
        return (
            <div>
                <div>{renderRow(0)}</div>
                <div>{renderRow(1)}</div>
                <div>{renderRow(2)}</div>
                <div>{renderRow(3)}</div>
                <div>{renderRow(4)}</div>
                <div>{renderRow(5)}</div>
            </div>
        );
    };

    const renderRow = (i: number) => {
        return (
            <div className="row">
                {renderSquare(playerState.board[i][0])}
                {renderSquare(playerState.board[i][1])}
                {renderSquare(playerState.board[i][2])}
                {renderSquare(playerState.board[i][3])}
                {renderSquare(playerState.board[i][4])}
            </div>
        );
    };

    const renderSquare = (letter: Letter) => {
        console.log(playerState.isWon)
        return <Square letter={letter} isOpponent={isOpponent}  hideLetters={isOpponent && playerState.isWon === null} />;
    };

    return <div>{renderGrid()}</div>;
};

const Square = ({
    letter,
    isOpponent,
    hideLetters,
}: {
    letter: Letter | undefined;
    isOpponent: boolean;
    hideLetters: boolean;
}) => {
    const [previousLetter, setPreviousLetter] = useState<Letter>()
    const [fadeInLetter, setFadeInLetter] = useState<boolean>(false)

    useEffect(() => {
        if (!previousLetter?.key && letter?.key) {
            setFadeInLetter(true)
        }
        if (!letter?.key) {
            setFadeInLetter(false)
        }
        setPreviousLetter(letter)
    }, [letter])

    if (!letter) {
        letter = { key: '', state: 'white', isError: false };
    }

    let className = `square ${letter.state}`;
    if (isOpponent) {
        className += ' small'
    }

    if (hideLetters) {
        return <Paper elevation={1} className={className}></Paper>;
    }

    if (letter.isError) {
        className += ' bad-word-anim';
    }

    return (
        <Paper elevation={1} className={className}>
            <Fade in={fadeInLetter} timeout={200}>
                <Typography fontSize={'26px'} className='text'>
                    {letter.key.toUpperCase()}
                </Typography>
            </Fade>
        </Paper>
    );
};
export { Board };
