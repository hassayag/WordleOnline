import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {Box, Container, Slide} from '@mui/material'

import { Wordle } from './wordle/wordle';
import Lobby from './lobby/lobby';
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
    else if (game.game_status === 'lobby') {
        return (<Lobby game={game} setGame={setGame}/>    )
    }

    return (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Container component="main" maxWidth="sm">
                <Box sx={{
                    width: 500,
                    height: 500,
                    marginTop: 8,
                    display: 'flex',
                    gap: "8px",
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Wordle
                        validGuesses={validGuesses}
                        game={game}
                    />
                </Box>
            </Container>
        </Slide>
    );
}

export default Game;
