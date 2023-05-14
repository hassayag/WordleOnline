import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Container, Slide } from '@mui/material';

import { Wordle } from './wordle/wordle';
import Lobby from './lobby/lobby';
import { WordService } from 'services/word-service';
import { GameService } from 'services/game-service';
import { SessionService } from 'services/session-service';
import './game.scss';

const Game = ({ uuid }) => {
    const navigate = useNavigate();

    const [validGuesses, setValidGuesses] = useState(null);
    const [game, setGame] = useState(null);
    const [cookies, setCookie] = useCookies(['session']);
    const [gameIsLoaded, setGameIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            // Get a random goal word
            const { words } = await WordService.getValidGuesses();
            setValidGuesses(words);
            
            if (!words) {
                console.warn(`Words not found`);
            }

            const gameObj = await GameService.getGame(uuid);
            
            if (!gameObj) {
                console.warn(`Game ID ${uuid} not found`);
            }
            else {                
                setGame(gameObj);
    
                let session;
    
                if (!cookies.session || cookies.session === 'undefined') {
                    session = await SessionService.createSession('Harry', game.id);
                } else {
                    session = await SessionService.getSession(cookies.session);
                }
    
                if (session.session_token) {
                    setCookie('session', session.session_token, { path: '/' });
                }
            }

            setGameIsLoaded(true);
        }
        fetchData();
    }, [uuid, cookies?.session, game?.id, setCookie]);

    if (!gameIsLoaded) {
        return <div> Retrieving purpose... </div>;
    } 
    // if there is no game at this point, then the use must not be validated
    // so redirect them to home
    else if (!game) {
        navigate(`/`);
        return; 
    }
    else if (game.game_status === 'lobby') {
        return <Lobby game={game} setGame={setGame} />;
    }


    return (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Container component="main" maxWidth="sm">
                <Box
                    sx={{
                        width: 500,
                        height: 500,
                        marginTop: 8,
                        display: 'flex',
                        gap: '8px',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Wordle validGuesses={validGuesses} game={game} />
                </Box>
            </Container>
        </Slide>
    );
};

export default Game;
