import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Button, Container, TextField } from '@mui/material';

import { GameService } from '@/services/game-service';
import { SessionService } from '@/services/session-service';

const CreateGame = ({ setGameIds }) => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [gameId, setGameId] = useState('');
    const [cookies, setCookie] = useCookies(['session']);

    const _initGame = async () => {
        let session;

        if (!cookies.session || cookies.session === 'undefined') {
            session = await SessionService.createSession(name);
            setCookie('session', session.session_token, { path: '/' });
        }

        GameService.createGame(name)
            .then((response) => setGameId(response.uuid))
            .catch((err) => console.error(err));
    };

    const _handleInput = (event) => {
        setName(event.target.value);
    };

    useEffect(() => {
        if (gameId) {
            // update game ids so Home component can rerender with the new game route
            setGameIds((ids) => [...ids, gameId]);

            navigate(`/game/${gameId}`);
        }
    }, [gameId]);

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
                    error={!name}
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
