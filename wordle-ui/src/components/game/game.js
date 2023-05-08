import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { Wordle } from './wordle/wordle';
import { WordService } from 'services/word-service';
import { GameService } from 'services/game-service';
import { SessionService } from 'services/session-service';
import './game.scss';

const Game = ({uuid}) => {

    const [validGuesses, setValidGuesses] = useState(null);
    const [game, setGame ] = useState(null);
    const [cookies, setCookie] = useCookies(['session']);

    useEffect(() => {
        async function fetchData() {
            // Get a random goal word
            const { words } = await WordService.getValidGuesses();
            setValidGuesses(words);

            const game = await GameService.getGame(uuid)
            setGame(game);
            
            if (!game) {
                console.warn(`Game ID ${uuid} not found`);
                return;
            }

            if (!words) {
                console.warn(`Words not found`);
                return;
            }

            let session

            if (!cookies.session || cookies.session === 'undefined' ) {
                session = await SessionService.createSession('Harry', game.id);
            } else {
                session = await SessionService.getSession(cookies.session);
            }

            if (session.session_token) {
                setCookie('session', session.session_token, { path: '/' });
            }
        }
        fetchData();
    }, [uuid, cookies?.session, game?.id, setCookie])
    
    if (!game) {
        return <div> Retrieving purpose... </div>;
    }


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
