import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Slide } from '@mui/material';

import Wordle from './wordle/wordle';
import Lobby from '../lobby/lobby';
import WordService from '@/services/word-service';
import GameService from '@/services/game-service';
import SynthControl from '@/components/synth/synth-control';
import config from '@/config/config';
import './game.scss';
import { Game, Letter } from './types';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import { useSession } from '@/hooks/useSession';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { PlayerBoard } from './player-info/player-info';

// using readyState enum
const connectionColorMap: Record<
    ReadyState,
    'primary' | 'secondary' | 'error'
> = {
    [ReadyState.CLOSED]: 'error',
    [ReadyState.CLOSING]: 'secondary',
    [ReadyState.CONNECTING]: 'secondary',
    [ReadyState.OPEN]: 'primary',
    [ReadyState.UNINSTANTIATED]: 'error',
};

interface SocketResponse {
    event: 'start_game' | 'send_word' | 'restart_game';
    data: string;
}

const GameComponent = ({ uuid, setGameUuids }: { uuid: string, setGameUuids: React.Dispatch<React.SetStateAction<string[]>>}) => {
    const navigate = useNavigate();
    const [validGuesses, setValidGuesses] = useState<string[] | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const { gameCookie, sessionCookie, setGameCookie } =
        useSession();
    const [playerIsValid, setPlayerIsValid] = useState<boolean | null>(null);
    // const [webSocket, setWebSocket] = useState<WebSocket>(new WebSocket(`${config.socketUrl}/?session=${sessionCookie}&game=${gameCookie}`));

    const { sendJsonMessage, readyState } = useWebSocket(
        config.socketUrl + `/?session=${sessionCookie}&game=${gameCookie}`,
        {
            onMessage: (msg) => handleMessage(msg),
        }
    );

    const refresh = useCallback(async () => {
        const gameObj = await GameService.getGame(uuid, sessionCookie);
        setGame(gameObj);
    }, [sessionCookie, uuid]);

    const startGame = useCallback(async () => {
        sendJsonMessage({ event: 'start_game' });
    }, [sendJsonMessage]);

    const restartGame = () => {
        sendJsonMessage({ event: 'restart_game'})
    }

    const sendGuess = useCallback(
        (guess: { row: number; word: Letter[] }) => {
            sendJsonMessage({ event: 'send_word', data: guess });
        },
        [sendJsonMessage]
    );

    const handleMessage = useCallback(
        async (msg: MessageEvent) => {
            const response = JSON.parse(msg.data) as SocketResponse;

            switch (response.event) {
                case 'start_game':
                    await refresh();
                    break;
                case 'send_word':
                    await refresh();
                    break
                case 'restart_game':
                    if (!response.data) {
                        console.error(`Missing uuid in response for "restart_game" socket command`)
                        return;
                    }
                    setGameUuids((uuids) => [response.data, ...uuids])
                    navigate(`/game/${response.data}`)
                    break;
            }
        },
        [refresh]
    );

    // useEffect(() => {
    //     if (webSocket) {
    //         console.log('LISTENING')
    //         webSocket.onmessage = (msg) => console.info('MESSAGE', msg)
    //         webSocket.onopen = () => console.info('SOCKET OPEN')
    //         webSocket.onclose = () => console.info('SOCKET CLOSED')
    //         webSocket.onerror = (err) => console.info('SOCKET ERROR -', err)

    //         return () => {
    //             webSocket.onmessage = null;
    //         };
    //     }
    // }, [handleMessage, webSocket])

    useEffect(() => {
        // Get a random goal word
        WordService.getValidGuesses()
            .then((response) => setValidGuesses(response))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const gameObj = await GameService.getGame(uuid, sessionCookie);

                setGame(gameObj);
                setPlayerIsValid(true);
                setGameCookie(gameObj.uuid);
            } catch (err) {
                setPlayerIsValid(false);
                navigate(`/game/join?uuid=${uuid}`);
            }
        }
        fetchData();
    }, [navigate, sessionCookie, uuid]);

    // player has not passed validation, so navigate to hom
    if (playerIsValid === false) {
        navigate(`/`);
        return <></>;
    }

    const connectionIcon = (
        <SignalWifiStatusbar4BarIcon
            sx={{
                position: 'absolute',
                right: 5,
                top: 5,
            }}
            color={connectionColorMap[readyState]}
        />
    );

    if (!game || !validGuesses) {
        return <div> Retrieving purpose... </div>;
    } else if (game.game_status === 'lobby') {
        return (
            <>
                {connectionIcon}
                <Lobby game={game} startGame={startGame} />;
            </>
        );
    }

    const emptyBox = <Box sx={{
        width: 485
    }}/>

    const opponentBoards = [emptyBox,emptyBox,emptyBox,emptyBox]
    game.otherStates.forEach((state, index) => (
        opponentBoards[index] =
        <Box sx={{
            width: 485
        }}>
            <PlayerBoard key={index} playerState={state} isOpponent={true} />
        </Box>
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
                    marginLeft: -27,
                    marginTop: 0,
                }}
            >
                {connectionIcon}
                <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                    <Container maxWidth="sm">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <Box
                                sx={{
                                    marginLeft: -10,
                                    marginRight: 10,
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    flexDirection: 'column'
                                }}
                            >
                                {opponentBoards.slice(0,2)}
                            </Box>
                            <Wordle
                                validGuesses={validGuesses}
                                game={game}
                                setGame={setGame}
                                sendGuess={sendGuess}
                                restartGame={restartGame}
                            />
                            <Box
                                sx={{
                                    marginLeft: 10,
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    flexDirection: 'column'
                                }}
                            >
                                {opponentBoards.length > 2 && opponentBoards.slice(2,4)}
                            </Box>
                        </Box>
                    </Container>
                </Slide>
                {config.feature_flags.synth && <SynthControl />}
            </Box>
        </main>
    );
};

export default GameComponent;
