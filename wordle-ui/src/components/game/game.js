import React from 'react';
import { Wordle } from './wordle/wordle';
import { WordService } from '../../index';
import './game.scss';

export class Game extends React.Component {
    constructor() {
        super();

        this.state = { validGuesses: null, goalWord: null };
    }
    async componentDidMount(){
        // Get a random goal word
        this._wordService = new WordService();

        this._wordService.getValidGuesses()
            .then(response => this.setState(prevState => Object.assign(prevState, { validGuesses: response.words })))
            .catch(err => console.error(err));

        this._wordService.getGoalWord()
            .then(response => this.setState(prevState => Object.assign(prevState, { goalWord: response.word })))
            .catch(err => console.error(err));
    }

    render() {
        // init new worlde game with random word
        return (
            <div>
                <div class='board-title'> Wordle </div>
                <Wordle validGuesses={this.state.validGuesses} goalWord={this.state.goalWord}/>
            </div>
        );
    }
}