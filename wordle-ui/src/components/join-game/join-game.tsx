import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

import GameService from '@/services/game-service';
import { useSession } from '@/hooks/useSession';

const JoinGame = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const queryUuid = query.get('uuid'); // 'uuid' is the name of the query parameter

    const [name, setName] = useState('');
    const [gameId, setGameId] = useState(queryUuid || '');
    const { sessionCookie, setGameCookie } = useSession();
    const [joinError, setJoinError] = useState<string>('');

    const joinGame = async () => {
        GameService.joinGame(gameId, name, sessionCookie)
            .then(() => {
                setGameCookie(gameId);
                navigate(`/game/${gameId}`);
            })
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
