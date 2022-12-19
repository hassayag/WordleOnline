import { useState } from 'react';
import { useNavigate, Link, Route, Routes } from "react-router-dom";

// my files
import './home.css';
import { GameService } from 'services/game-service';
import { Game } from 'index';
import CreateGame from './create-game/create-game'

const Navbar = () => {
    const [gameIds, setGameIds] = useState(null);

    if (!gameIds) {
        GameService.getGames()
            .then(response => setGameIds(response.uuids))
            .catch(err => console.error(err));
    }

    return (
        <>
            <nav id='navbar'>
                <Link to="/">Home</Link>
                {/* <Link to="/game/create">Play a Game</Link> */}
            </nav>
            <Routes>
                <Route path="/" element={<Home/>} />
                {/* <Route path="/game" element={<Game/>} /> */}
                <Route path="/game/create" element={<CreateGame setGameIds={setGameIds}/>} />
                {_getGameRoutes(gameIds)}
            </Routes>       
        </>
    )
}

const _getGameRoutes = (ids) => {
    if (!ids?.length) {
        return;
    }

    const routes = ids.map(id => <Route path={`/game/${id}`} element={<Game/>} />);

    return routes;
}

const Home = () => {
    const navigate = useNavigate();

    return (
        <div id='home-message'>
            Welcome to WordleOnline
            <div id='button-group'>
                <button id='green-button'>Join Game</button>
                <button id='yellow-button'onClick={() => navigate('/game/create')}>Create Game</button>
            </div>
        </div>
    )
}

export default Navbar;