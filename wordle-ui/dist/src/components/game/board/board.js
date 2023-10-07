import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Paper } from '@mui/material';
import './board.scss';
class Board extends React.Component {
    render() {
        this.wordRows = this.props.wordRows;
        return _jsx("div", { className: "word-grid", children: this.renderGrid() });
    }
    renderGrid() {
        return (_jsxs("div", { children: [_jsx("div", { children: this.renderRow(0) }), _jsx("div", { children: this.renderRow(1) }), _jsx("div", { children: this.renderRow(2) }), _jsx("div", { children: this.renderRow(3) }), _jsx("div", { children: this.renderRow(4) }), _jsx("div", { children: this.renderRow(5) })] }));
    }
    renderRow(i) {
        return (_jsxs("div", { children: [this.renderSquare(this.wordRows[i][0]), this.renderSquare(this.wordRows[i][1]), this.renderSquare(this.wordRows[i][2]), this.renderSquare(this.wordRows[i][3]), this.renderSquare(this.wordRows[i][4])] }));
    }
    renderSquare(letter) {
        return _jsx(Square, { letter: letter });
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
        return (_jsx(Paper, { elevation: 1, className: className, children: letter.key.toUpperCase() }));
    }
}
export { Board };
//# sourceMappingURL=board.js.map