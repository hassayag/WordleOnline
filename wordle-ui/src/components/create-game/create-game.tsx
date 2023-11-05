import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

import GameService from '@/services/game-service';
import SessionService from '@/services/session-service';
import { useGameCookies } from '@/hooks/useGameCookies';

const CreateGame = ({
    gameUuids,
    setGameUuids,
}: {
    gameUuids: string[];
    setGameUuids: React.Dispatch<string[]>;
}) => {
    const navigate = useNavigate();

    const [name, setName] = useState<string>('');
    const [gameId, setGameId] = useState<string>('');
    const {sessionCookie, setGameCookie, setSessionCookie} = useGameCookies();
    const [createError, setCreateError] = useState<string>('');

    const _initGame = async () => {
        let session;

        if (!sessionCookie|| sessionCookie === 'undefined') {
            session = await SessionService.createSession(gameId);
            setSessionCookie(session.session_token);
        }

        GameService.createGame(name, sessionCookie)
            .then((response) => {
                setGameId(response.uuid)
                setGameCookie(response.uuid)
            })
            .catch((err) => setCreateError(err?.message));
    };

    const _handleInput = (event: React.ChangeEvent<any>) => {
        setName(event.target.value);
    };

    useEffect(() => {
        if (gameId) {
            // update game ids so Home component can rerender with the new game route
            setGameUuids([...gameUuids, gameId]);

            navigate(`/game/${gameId}`);
        }
    }, [setGameUuids, gameId, navigate, gameUuids]);

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
                    <Typography component="body" variant="body2" color="error">
                        {createError}
                    </Typography>
                </Box>
            </Container>
        </main>
    );
};

export default CreateGame;
