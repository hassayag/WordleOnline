import './home.css';
import { Game } from "../game/game"
import { Link, Route, Routes } from "react-router-dom";

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