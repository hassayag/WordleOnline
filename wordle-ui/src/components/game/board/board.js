import React from 'react';
import './board.scss';

class Board extends React.Component {           
    render() {
        const status = 'Player Name,  Score';

        this.wordRows = this.props.wordRows;
        
        return (
            <div>
                <div className="word-grid">
                    {/* <div className="status">{status}</div> */}
                    {this.renderGrid()}
                </div>
            </div>
        );
    }
    
    renderGrid() {
        return <div>
            <div>{this.renderRow(0)}</div>
            <div>{this.renderRow(1)}</div>
            <div>{this.renderRow(2)}</div>
            <div>{this.renderRow(3)}</div>
            <div>{this.renderRow(4)}</div>
            <div>{this.renderRow(5)}</div>
        </div>
    }
    
    renderRow(i) {
        return <div>
            {this.renderSquare(this.wordRows[i][0])}
            {this.renderSquare(this.wordRows[i][1])}
            {this.renderSquare(this.wordRows[i][2])}
            {this.renderSquare(this.wordRows[i][3])}
            {this.renderSquare(this.wordRows[i][4])}
        </div>
    }
    
    renderSquare(letter) {
        return <Square letter={letter} />;
    }
    
}

class Square extends React.Component {
    render() {
        // default to blank white square
        let letter = { key: '', state: 'white' };

        if (this.props.letter) {
            letter = this.props.letter;
        }

        return (
            <div className={`square ${letter.state}`}>
                {letter.key.toUpperCase()}
            </div>
        );
    }

}
export { Board };