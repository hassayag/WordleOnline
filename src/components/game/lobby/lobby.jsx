'use client'

import { Box, Button, Container, Typography } from '@mui/material';
import { GameService } from '@/services/game-service';

const Lobby = ({ game, setGame }) => {
    const names = game.state.map((item) => item.player.name);

    return (
        <>
            <Container component="main" maxWidth="sm">
                <Box
                    sx={{
                        position: 'absolute',
                        left: 100,
                        width: 2000,
                        marginTop: 8,
                        display: 'flex',
                        gap: '8px',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: 500,
                            display: 'flex',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Players names={names} />
                    </Box>

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
                        <Typography variant="h4" component="h1" gutterBottom>
                            Game Lobby
                        </Typography>

                        <Typography
                            variant="black"
                            component="body"
                            gutterBottom
                        >
                            Share this link to play with a friend - {game.uuid}
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() =>
                                setGame((game) => {
                                    GameService.updateGame(game.uuid, {
                                        game_status: 'in_progress',
                                    });
                                    Object.assign(game, {
                                        game_status: 'in_progress',
                                    });
                                })
                            }
                        >
                            Start Game
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

const Players = ({ names }) => {
    return names.map((name) => {
        return (
            <Typography component="body" variant="nameTag">
                {' '}
                {name}{' '}
            </Typography>
        );
    });
};

export default Lobby;
