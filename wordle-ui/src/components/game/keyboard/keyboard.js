import React from 'react';
import { Box, Paper } from '@mui/material';

import './keyboard.scss';
import synthService from '../../../services/synth-service'

class Keyboard extends React.Component {
    letters = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ];

    componentDidMount() {
        const pressKey = (letter) => {
            this.props.onPress(letter);
            synthService.triggerSound(letter)
        }

        document.body.addEventListener('keydown', (event) =>
            pressKey(event.key)
        );
    }

    componentWillUnmount() {
        const pressKey = (letter) => this.props.onPress(letter);

        synthService.stopLoops();

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
            <Box
                sx={{
                    display: 'flex',
                    gap: '8px',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {this.renderRow(0)}
                {this.renderRow(1)}
                {this.renderRow(2)}
            </Box>
        );
    }
}

const Key = ({ inputLetter, onPress, keyState }) => {
    const pressKey = () => {
        onPress(inputLetter);
        synthService.triggerSound(inputLetter)
    }

    return (
        <Paper elevation={1}>
            <button key={inputLetter} className={`key ${keyState}`} onClick={pressKey}>
                {inputLetter.toUpperCase()}
            </button>
        </Paper>
    );
}

export { Keyboard };
