import {Box, Button, Container, Typography} from '@mui/material';
import { GameService } from 'services/game-service';
import PlayerCard from './player-card/player-card'

const Lobby = ({game, setGame}) => {
    return (<>
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
                <Typography variant="h4" component="h1" gutterBottom>
                    Game Lobby
                </Typography>

                <Typography variant="body2" component="body" gutterBottom>
                    Share this link to play with a friend - {game.uuid}
                </Typography>

                <PlayerCard name={'Harry'}/>

                <Button variant="contained" onClick={() => setGame((game) => {
                        GameService.updateGame(game.uuid, {gameStatus: 'in_progress'})
                        Object.assign(game, {game_status:'in_progress'});
                    })}>
                    Start Game
                </Button>
            </Box>
        </Container>
    </>)
}

export default Lobby;