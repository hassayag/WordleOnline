import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Box, Button, Container, TextField } from '@mui/material';
import { GameService } from '@/services/game-service';
import { SessionService } from '@/services/session-service';
const JoinGame = ({ setGameIds }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [gameId, setGameId] = useState('');
    const [cookies, setCookie] = useCookies(['session']);
    const initGame = async () => {
        let session;
        if (!cookies.session || cookies.session === 'undefined') {
            session = await SessionService.createSession(name);
            setCookie('session', session.session_token, { path: '/' });
        }
        GameService.joinGame();
    };
    return (_jsx(Container, { component: "main", maxWidth: "sm", children: _jsxs(Box, { sx: {
                width: 500,
                height: 500,
                marginTop: 8,
                display: 'flex',
                gap: '8px',
                flexDirection: 'column',
                alignItems: 'center',
            }, children: [_jsx(TextField, { id: "outlined-basic", label: "Enter Name", variant: "outlined", onChange: (event) => setName(event.target.value) }), _jsx(Button, { variant: "contained", onClick: () => initGame(), children: "Join Game" })] }) }));
};
export default JoinGame;
//# sourceMappingURL=join-game.js.map