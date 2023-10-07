import React from 'react';
import { Paper } from '@mui/material';
import './board.scss';

class Board extends React.Component {
    render() {
        this.wordRows = this.props.wordRows;

        return <div className="word-grid">{this.renderGrid()}</div>;
    }

    renderGrid() {
        return (
            <div>
                <div>{this.renderRow(0)}</div>
                <div>{this.renderRow(1)}</div>
                <div>{this.renderRow(2)}</div>
                <div>{this.renderRow(3)}</div>
                <div>{this.renderRow(4)}</div>
                <div>{this.renderRow(5)}</div>
            </div>
        );
    }

    renderRow(i) {
        return (
            <div>
                {this.renderSquare(this.wordRows[i][0])}
                {this.renderSquare(this.wordRows[i][1])}
                {this.renderSquare(this.wordRows[i][2])}
                {this.renderSquare(this.wordRows[i][3])}
                {this.renderSquare(this.wordRows[i][4])}
            </div>
        );
    }

    renderSquare(letter) {
        return <Square letter={letter} />;
    }
}

class Square extends React.Component {
    render() {
        // default to blank white square
        let letter = { key: '', state: 'white', isError: false };

        if (this.props.letter) {
            letter = this.props.letter;
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
}
export { Board };
