import React from 'react';
import './board.scss';

class Board extends React.Component {           
    render() {
        const status = 'Player Name,  Score';

        this.wordRows = this.props.wordRows;
        
        return (
            <div>
                <div className="word-grid">
                    <div className="status">{status}</div>
                    {this.renderGrid()}
                </div>
            </div>
        );
    }
    
    renderGrid() {
        return <div>
            {this.renderRow(0)}
            {this.renderRow(1)}
            {this.renderRow(2)}
            {this.renderRow(3)}
            {this.renderRow(4)}
            {this.renderRow(5)}
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
        return (
            <div className="square">
                {this.props.letter}
            </div>
        );
    }

}
export { Board };