import React from 'react';
import { Wordle } from './wordle/wordle';
import { WordService } from 'services/word-service';
import { GameService } from 'services/game-service';
import { SessionService } from 'services/session-service';
import './game.scss';

export class Game extends React.Component {
    constructor() {
        super();

        this.state = { validGuesses: null, game: null };
    }

    async componentDidMount() {
        // Get a random goal word
        WordService.getValidGuesses()
            .then((response) =>
                this.setState((prevState) =>
                    Object.assign(prevState, { validGuesses: response.words })
                )
            )
            .catch((err) => console.error(err));

        GameService.getGame(this.props.uuid)
            .then((response) =>
                this.setState((prevState) =>
                    Object.assign(prevState, { game: response })
                )
            )
            .catch((err) => console.error(err));
    }

    render() {
        if (!this.state.game) {
            return <div> Retrieving purpose... </div>;
        }

        if ('caches' in window) {
            // Opening given cache and putting our data into it
            caches.open('session').then((cache) => {
                console.log(cache);
                let session;

                if (!cache.token) {
                    session = SessionService.createSession(
                        'test_name',
                        this.state.game.id
                    );
                } else {
                    session = SessionService.getSession(cache);
                }

                cache.put('session', session);
                alert('Data Added into cache!');
            });
        }

        return (
            <div>
                <div class="board-title"> Wordle </div>
                <Wordle
                    validGuesses={this.state.validGuesses}
                    game={this.state.game}
                />
            </div>
        );
    }
}
