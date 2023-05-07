import React from 'react';
import './keyboard.scss';

class Keyboard extends React.Component {
    letters = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ];

    componentDidMount() {
        const pressKey = (letter) => this.props.onPress(letter);

        document.body.addEventListener('keydown', (event) =>
            pressKey(event.key)
        );
    }

    componentWillUnmount() {
        const pressKey = (letter) => this.props.onPress(letter);

        document.body.removeEventListener('keydown', (event) =>
            pressKey(event.key)
        );
    }

    // render each key in the row
    renderRow(i) {
        const row = [];

        let letter;

        for (let j = 0; j < this.letters[i].length; j++) {
            letter = this.letters[i][j];

            row.push(
                <Key
                    inputLetter={letter}
                    onPress={this.props.onPress}
                    keyState={this.props.keyStates[letter]}
                />
            );
        }

        return (
            <div key={i} className="keyboard-row">
                {row}
            </div>
        );
    }

    // render all three rows of keyboard
    render() {
        return (
            <div className="keyboard">
                {this.renderRow(0)}
                {this.renderRow(1)}
                {this.renderRow(2)}
            </div>
        );
    }
}

class Key extends React.Component {
    render() {
        const { inputLetter, onPress, keyState } = this.props,
            pressKey = () => onPress(inputLetter);

        return (
            <button className={`key ${keyState}`} onClick={pressKey}>
                {inputLetter.toUpperCase()}
            </button>
        );
    }
}

export { Keyboard };
