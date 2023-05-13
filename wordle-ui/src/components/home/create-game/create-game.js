import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField } from '@mui/material';

import './create-game.css';
import { GameService } from 'services/game-service';

  
const CreateGame = ({ setGameIds }) => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [gameId, setGameId] = useState('');

    const _initGame = () => {
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
        <Container component="main" maxWidth="sm">
            <Box sx={{
                width: 500,
                height: 500,
                marginTop: 8,
                display: 'flex',
                gap: "8px",
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <TextField id="outlined-basic" label="Enter Name" variant="outlined"  
                    onChange={(event) => _handleInput(event)}/>

                <Button variant="contained" onClick={() => _initGame()}>
                    Create game
                </Button>
            </Box>
        </Container>
    );
};

export default CreateGame;
