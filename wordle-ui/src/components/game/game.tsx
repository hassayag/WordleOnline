import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Container, Slide } from '@mui/material';

import { Wordle } from './wordle/wordle';
import Lobby from '../lobby/lobby';
import WordService from '@/services/word-service';
import GameService from '@/services/game-service';
import { SessionService } from '@/services/session-service';
import SynthControl from '@/components/synth/synth-control';
import config from '@/config/config'
import './game.scss';
import OppponentBoard from './opponent-board/opponent-board';
import { Game } from './types'

const GameComponent = ({ uuid }: {uuid: string}) => {
    const navigate = useNavigate();

    const [validGuesses, setValidGuesses] = useState<string[] | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [cookies, setCookie] = useCookies(['session']);
    const [playerIsValid, setPlayerIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        async function fetchData() {
            // Get a random goal word
            const words = await WordService.getValidGuesses();
            setValidGuesses(words);

            if (!words) {
                console.warn(`Words not found`);
            }

            const gameObj: Game = await GameService.getGame(uuid);

            if (!gameObj) {
                console.warn(`Game ID ${uuid} not found`);
                setPlayerIsValid(false);
            } else {
                setGame(gameObj);
                setPlayerIsValid(true);

                let session;

                if (!cookies.session || cookies.session === 'undefined') {
                    session = await SessionService.createSession(
                        'Harry',
                        gameObj.id
                    );
                    setCookie('session', session.session_token, { path: '/' });
                }
                // else {
                //     session = await SessionService.getSession(cookies.session);
                // }

                // if (session?.session_token) {
                //     setCookie('session', session.session_token, { path: '/' });
                // }
            }
        }
        fetchData();
    }, [uuid, cookies?.session, game?.id, setCookie]);

    // player has not passed validation, so navigate to hom
    if (playerIsValid === false) {
        navigate(`/`);
        return <></>;
    }
    if (!game || !validGuesses) {
        return <div> Retrieving purpose... </div>;
    } else if (game.game_status === 'lobby') {
        return <Lobby game={game} setGame={setGame} />;
    }

    const opponentGameStates = game.state.filter(state => state.player.sessionToken !== cookies.session)
    const opponentBoards = opponentGameStates.map((state, index) => <OppponentBoard key={index} state={state} />)

    return (
        <main>

        <Box sx={{
                width: '100%',
                display: 'flex',
                gap: '8px',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 30,
                marginTop: 10
        }}>
            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Container component="main" maxWidth="sm">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Wordle validGuesses={validGuesses} game={game}/>
                    </Box>
                </Container>
            </Slide>
            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                <Container component="main" maxWidth="sm">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {opponentBoards}
                    </Box>
                </Container>
            </Slide>
        
            {config.feature_flags.synth && <SynthControl/>}
        </Box>
        </main>
    );
};

export default GameComponent;
