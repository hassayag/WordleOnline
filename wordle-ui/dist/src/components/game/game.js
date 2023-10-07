import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Container, Slide } from '@mui/material';
import { Wordle } from './wordle/wordle';
import Lobby from './lobby/lobby';
import { WordService } from '@/services/word-service';
import { GameService } from '@/services/game-service';
import { SessionService } from '@/services/session-service';
import SynthControl from '@/components/synth/synth-control';
import config from '@/config/config';
import './game.scss';
const Game = ({ uuid }) => {
    const navigate = useNavigate();
    const [validGuesses, setValidGuesses] = useState(null);
    const [game, setGame] = useState(null);
    const [cookies, setCookie] = useCookies(['session']);
    const [playerIsValid, setPlayerIsValid] = useState(null);
    useEffect(() => {
        async function fetchData() {
            // Get a random goal word
            const { words } = await WordService.getValidGuesses();
            setValidGuesses(words);
            if (!words) {
                console.warn(`Words not found`);
            }
            const gameObj = await GameService.getGame(uuid);
            if (!gameObj) {
                console.warn(`Game ID ${uuid} not found`);
                setPlayerIsValid(false);
            }
            else {
                setGame(gameObj);
                setPlayerIsValid(true);
                let session;
                if (!cookies.session || cookies.session === 'undefined') {
                    session = await SessionService.createSession('Harry', game.id);
                    setCookie('session', session.session_token, { path: '/' });
                }
                // else {
                //     session = await SessionService.getSession(cookies.session);
                // }
                // if (session?.session_token) {
                //     setCookie('session', session.session_token, { path: '/' });
                // }
            }
        }
        fetchData();
    }, [uuid, cookies === null || cookies === void 0 ? void 0 : cookies.session, game === null || game === void 0 ? void 0 : game.id, setCookie]);
    // player has not passed validation, so navigate to hom
    if (playerIsValid === false) {
        navigate(`/`);
        return;
    }
    if (!game) {
        return _jsx("div", { children: " Retrieving purpose... " });
    }
    else if (game.game_status === 'lobby') {
        return _jsx(Lobby, { game: game, setGame: setGame });
    }
    return (_jsxs(Box, { sx: {
            width: 1000,
            display: 'flex',
            gap: '8px',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 30,
            marginTop: 10
        }, children: [_jsx(Slide, { direction: "up", in: true, mountOnEnter: true, unmountOnExit: true, children: _jsx(Container, { component: "main", maxWidth: "sm", children: _jsx(Box, { sx: {
                            width: 500,
                            height: 500,
                            marginTop: 8,
                            display: 'flex',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }, children: _jsx(Wordle, { validGuesses: validGuesses, game: game }) }) }) }), config.feature_flags.synth && _jsx(SynthControl, {})] }));
};
export default Game;
//# sourceMappingURL=game.js.map