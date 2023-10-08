import React from 'react';
import { Paper } from '@mui/material';
import './board.scss';
import { PlayerState, Letter } from '../types';

const Board = ({state}: { state: PlayerState }) => {
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
    }

    const renderRow = (i: number) => {
        return (
            <div>
                {renderSquare(state.board[i][0])}
                {renderSquare(state.board[i][1])}
                {renderSquare(state.board[i][2])}
                {renderSquare(state.board[i][3])}
                {renderSquare(state.board[i][4])}
            </div>
        );
    }

    const renderSquare = (letter: Letter) => {
        return <Square letter={letter} />;
    }

    return <div className="word-grid">{renderGrid()}</div>;
}

const Square = ({letter}: { letter: Letter|undefined }) => {
    if (!letter) {
        letter = { key: '', state: 'white', isError: false };
    }

    let className = `square ${letter.state}`;

    if (letter.isError) {
        className = `${className} bad-word-anim`;
    }

    return (
        <Paper elevation={1} className={className}>
            {letter.key.toUpperCase()}
        </Paper>
    );
}
export { Board };
