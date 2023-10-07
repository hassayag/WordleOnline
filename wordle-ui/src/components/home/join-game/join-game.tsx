import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Button, Container, TextField } from '@mui/material';

import { GameService } from '@/services/game-service';
import { SessionService } from '@/services/session-service';

const JoinGame = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [gameId, setGameId] = useState('');
    const [cookies, setCookie] = useCookies(['session']);

    const joinGame = async () => {
        let session;

        if (!cookies.session || cookies.session === 'undefined') {
            session = await SessionService.createSession(name);
            setCookie('session', session.session_token, { path: '/' });
        }

        GameService.joinGame(gameId, name);
    };

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
                        id="outlined-basic"
                        label="Enter Game Code"
                        required={!gameId || !name}
                        variant="outlined"
                        onChange={(event) => setGameId(event.target.value)}
                    />

                    <TextField
                        id="outlined-basic"
                        label="Enter Name"
                        required={!gameId || !name}
                        variant="outlined"
                        onChange={(event) => setName(event.target.value)}
                    />

                    <Button
                        variant="contained"
                        disabled={!gameId || !name}
                        onClick={() => joinGame()}
                    >
                        Join Game
                    </Button>
                </Box>
            </Container>
        </main>
    );
};

export default JoinGame;
