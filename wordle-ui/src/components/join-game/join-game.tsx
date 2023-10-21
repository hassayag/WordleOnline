import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

import GameService from '@/services/game-service';
import SessionService from '@/services/session-service';

const JoinGame = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const queryUuid = query.get('uuid'); // 'id' is the name of the query parameter

    const [name, setName] = useState('');
    const [gameId, setGameId] = useState(queryUuid || '');
    const [cookies, setCookie] = useCookies(['session']);
    const [joinError, setJoinError] = useState<string>('');

    const joinGame = async () => {
        let session;

        if (!cookies.session || cookies.session === 'undefined') {
            session = await SessionService.createSession(name);
            setCookie('session', session.session_token, { path: '/' });
        }

        GameService.joinGame(gameId, name)
            .then(() => navigate(`/game/${gameId}`))
            .catch((err: any) => setJoinError(err?.message));
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
                        value={gameId}
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
                    <Typography component="body" variant="body2" color="error">
                        {joinError}
                    </Typography>
                </Box>
            </Container>
        </main>
    );
};

export default JoinGame;
