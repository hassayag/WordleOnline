import React, { useEffect, useState } from 'react';

import CookieHelper from 'components/helpers/cookie-helper';
import { Wordle } from './wordle/wordle';
import { WordService } from 'services/word-service';
import { GameService } from 'services/game-service';
import { SessionService } from 'services/session-service';
import './game.scss';

const Game = ({uuid}) => {

    // state = { validGuesses: null, game: null };
    const [validGuesses, setValidGuesses] = useState(null);
    const [game, setGame ] = useState(null);

    useEffect(() => {
        // Get a random goal word
        WordService.getValidGuesses()
            .then((response) => setValidGuesses(response.words))
            .catch((err) => console.error(err));

        GameService.getGame(uuid)
            .then((response) => setGame(response))
            .catch((err) => console.error(err));
    });

    
    if (!game) {
        return <div> Retrieving purpose... </div>;
    }

    let session;

    // if (!cache.token) {
    //     session = await SessionService.createSession(
    //         'test_name',
    //         state.game.id
    //     );
    // } else {
    //     session = await SessionService.getSession(cache);
    //     cache.put('session', session);
    //     alert('Data Added into cache!');
    // }

    return (
        <div>
            <div class="board-title"> Wordle </div>
            <Wordle
                validGuesses={validGuesses}
                game={game}
            />
        </div>
    );
}

export default Game;
