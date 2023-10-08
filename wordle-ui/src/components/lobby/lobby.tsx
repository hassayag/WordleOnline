import { Box, Button, Container, Typography } from '@mui/material';
import { GameService } from '@/services/game-service';
import React from 'react';
import { Game } from '../game/types';

const Lobby = ({ game, setGame }: {game: Game, setGame: React.Dispatch<Game | null>}) => {
    const names = game.state.map((item) => item.player.name);

    return (
        <main>
            <Container component="main" maxWidth="sm">
                <Box
                    sx={{
                        left: 100,
                        width: 600,
                        marginTop: 8,
                        marginLeft: 20,
                        display: 'flex',
                        gap: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Box
                        sx={{
                            width: 500,
                            height: 500,
                            display: 'flex',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom>
                            Players
                        </Typography>
                        <Players names={names} />
                    </Box>

                    <Box
                        sx={{
                            width: 500,
                            height: 500,
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
                            component="body"
                            variant="body2"
                            gutterBottom
                        >
                            Share this link to play with a friend - {game.uuid}
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => {
                                GameService.updateGame(game.uuid, 'in_progress');
                                setGame({
                                    ...game,
                                    game_status: 'in_progress',
                                })
                            }}
                        >
                            Start Game
                        </Button>
                    </Box>
                </Box>
            </Container>
        </main>
    );
};

const Players = ({ names }: { names: string[] }) => {
    const players = names.map((name: string, index) => {
        return (
            <Typography key={index} component="body" variant="body2">
                {' '}
                {name}{' '}
            </Typography>
        );
    });

    return (<>
        players
    </>)
};

export default Lobby;
