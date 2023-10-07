import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Button, Container, TextField } from '@mui/material';

import { GameService } from '@/services/game-service';
import { SessionService } from '@/services/session-service';

const JoinGame = ({ setGameIds }) => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [gameId, setGameId] = useState('');
    const [cookies, setCookie] = useCookies(['session']);

    const initGame = async () => {
        let session;

        if (!cookies.session || cookies.session === 'undefined') {
            session = await SessionService.createSession(name);
            setCookie('session', session.session_token, { path: '/' });
        }

        GameService.joinGame()
    };

    return (
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
                <TextField
                    id="outlined-basic"
                    label="Enter Name"
                    variant="outlined"
                    onChange={(event) => setName(event.target.value)}
                />

                <Button variant="contained" onClick={() => initGame()}>
                    Join Game
                </Button>
            </Box>
        </Container>
    );
};

export default JoinGame;
