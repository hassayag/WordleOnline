import { useNavigate } from 'react-router-dom';
import './home.css';
import CreateGame from './create-game/create-game'
import { Link, Route, Routes } from "react-router-dom";
import { Game } from 'index';

const Navbar = () => {
    return (
        <>
            <nav id='navbar'>
                <Link to="/">Home</Link>
                {/* <Link to="/game/create">Play a Game</Link> */}
            </nav>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/game" element={<Game/>} />
                <Route path="/game/create" element={<CreateGame/>} />
            </Routes>
        </>
    )
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