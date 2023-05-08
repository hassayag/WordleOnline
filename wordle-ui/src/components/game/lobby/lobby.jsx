import { GameService } from 'services/game-service';
import PlayerCard from './player-card/player-card'

const Lobby = ({game, setGame}) => {
    return (<>
        <h1>
            Game Lobby
        </h1>
        <div>
            Share this link to play with a friend - {game.uuid}
        </div>
        <PlayerCard name={'Harry'}/>

        <button id="body" onClick={() => setGame((game) => {
                GameService.updateGame(game.uuid, {gameStatus: 'in_progress'})
                Object.assign(game, {game_status:'in_progress'});
            })
        }>
                Create game
        </button>
    </>)
}

export default Lobby;