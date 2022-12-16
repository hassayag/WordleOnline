import './home.css';
import CreateGame from './create-game/create-game'
import { Link, Route, Routes } from "react-router-dom";
import { Game } from 'index';

const Navbar = () => {
    return (
        <>
            <nav id='navbar'>
                <Link to="/">Home</Link>
                <Link to="/game">Play a Game</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/game" element={<Game/>} />
            </Routes>
        </>
    )
}

const Home = () => {
    return (
        <div id='home-message'>
            Welcome to WordleOnline
        </div>
    )
}

export default Navbar;