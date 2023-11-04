import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Container, Slide } from '@mui/material';

import Wordle from './wordle/wordle';
import Lobby from '../lobby/lobby';
import WordService from '@/services/word-service';
import GameService from '@/services/game-service';
import SessionService from '@/services/session-service';
import SynthControl from '@/components/synth/synth-control';
import config from '@/config/config';
import './game.scss';
import { Game, Letter } from './types';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import { PlayerInfo } from './player-info/player-info';

// using readyState enum
const connectionColorMap: Record<ReadyState, 'primary' | 'secondary' | 'error'> = {
    [ReadyState.CLOSED]: 'error',
    [ReadyState.CLOSING]: 'secondary',
    [ReadyState.CONNECTING]: 'secondary',
    [ReadyState.OPEN]: 'primary',
    [ReadyState.UNINSTANTIATED]: 'error', 

}

interface SocketResponse {
    event: 'start_game' | 'send_word',
    data?: string
} 

const GameComponent = ({ uuid }: { uuid: string }) => {
    const navigate = useNavigate();
    const [validGuesses, setValidGuesses] = useState<string[] | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [cookies, setCookie] = useCookies(['session', 'game']);
    const [playerIsValid, setPlayerIsValid] = useState<boolean | null>(null);
    const { sendJsonMessage, readyState } = useWebSocket('ws://localhost:8081', {
        onMessage: (msg) => handleMessage(msg)
    });

    const refresh = useCallback(async () => {
        const gameObj = await GameService.getGame(uuid);
        setGame(gameObj);
    }, [uuid])

    const sendGuess = useCallback((guess: {row: number, word: Letter[]}) => {
        sendJsonMessage({event: 'send_word', data: guess})
    },[sendJsonMessage])

    const handleMessage = useCallback(async (msg: MessageEvent) => {
        const response = JSON.parse(msg.data) as SocketResponse
        if (response.event === 'start_game') {
            await refresh()
        }
        else if (response.event === 'send_word') {
            await refresh()
        }
    }, [refresh])

    const startGame = useCallback(async () => {
        sendJsonMessage({event: 'start_game'})
    }, [sendJsonMessage])

    useEffect(() => {
        // Get a random goal word
        WordService.getValidGuesses()
            .then((response) => setValidGuesses(response))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const gameObj = await GameService.getGame(uuid);

                setGame(gameObj);
                setPlayerIsValid(true);
                setCookie('game', gameObj.uuid, { path: '/' })

                let session;

                if (!cookies.session || cookies.session === 'undefined') {
                    session = await SessionService.createSession(
                        'Harry',
                        gameObj.id
                    );
                    setCookie('session', session.session_token, { path: '/' });
                }
            } catch (err) {
                setPlayerIsValid(false);
                navigate(`/game/join?uuid=${uuid}`);
            }
        }
        fetchData();
    }, [cookies, navigate, setCookie, uuid]);

    // player has not passed validation, so navigate to hom
    if (playerIsValid === false) {
        navigate(`/`);
        return <></>;
    }

    const connectionIcon = (<SignalWifiStatusbar4BarIcon
        sx={{
            position: 'absolute',
            right: 5,
            top: 5
        }}
        color={connectionColorMap[readyState]}
    />)

    if (!game || !validGuesses) {
        return <div> Retrieving purpose... </div>;
    } else if (game.game_status === 'lobby') {
        return (<>
        {connectionIcon}
        <Lobby game={game} startGame={startGame} />;
        </>)
    }

    const opponentBoards = game.otherStates.map((state, index) => (
        <PlayerInfo key={index} playerState={state} isOpponent={true} />
    ));

    return (
        <main>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: '8px',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 30,
                    marginTop: 10,
                }}
            >
                {connectionIcon}
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
                            <Wordle validGuesses={validGuesses} game={game} setGame={setGame} sendGuess={sendGuess} />
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

                {config.feature_flags.synth && <SynthControl />}
            </Box>
        </main>
    );
};

export default GameComponent;
