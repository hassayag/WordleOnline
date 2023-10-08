import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Button, Container, TextField } from '@mui/material';

import { GameService } from '@/services/game-service';
import { SessionService } from '@/services/session-service';

const CreateGame = ({ gameUuids, setGameUuids }: {gameUuids: string[], setGameUuids: React.Dispatch<string[]>}) => {
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [gameUuid, setGameUuid] = useState<string>('');
    const [cookies, setCookie] = useCookies(['session']);

    const _initGame = async () => {
        let session;

        if (!cookies.session || cookies.session === 'undefined') {
            session = await SessionService.createSession(name);
            setCookie('session', session.session_token, { path: '/' });
        }

        GameService.createGame(name)
            .then((response) => setGameUuid(response.uuid))
            .catch((err) => console.error(err));
    };

    const _handleInput = (event: React.ChangeEvent<any>) => {
        setName(event.target.value);
    };

    useEffect(() => {
        if (gameUuid) {
            console.log({gameUuids, gameUuid})
            // update game ids so Home component can rerender with the new game route
            setGameUuids([...gameUuids, gameUuid]);

            navigate(`/game/${gameUuid}`);
        }
    }, [setGameUuids, gameUuid, navigate, gameUuids]);

    return (
        <main>
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    width: 500,
                    height: 500,
                    marginLeft: '50%',
                    marginTop: 8,
                    display: 'flex',
                    gap: '8px',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TextField
                    required={!name}
                    label="Enter Name"
                    variant="outlined"
                    onChange={(event) => _handleInput(event)}
                />

                <Button
                    disabled={!name}
                    variant="contained"
                    onClick={() => _initGame()}
                >
                    Create Game
                </Button>
            </Box>
        </Container>
        </main>
    );
};

export default CreateGame;
