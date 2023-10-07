import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button, Container, Typography } from '@mui/material';
import { GameService } from '@/services/game-service';
const Lobby = ({ game, setGame }) => {
    const names = game.state.map((item) => item.player.name);
    return (_jsx(_Fragment, { children: _jsx(Container, { component: "main", maxWidth: "sm", children: _jsxs(Box, { sx: {
                    position: 'absolute',
                    left: 100,
                    width: 2000,
                    marginTop: 8,
                    display: 'flex',
                    gap: '8px',
                    flexDirection: 'row',
                    alignItems: 'center',
                }, children: [_jsx(Box, { sx: {
                            width: 500,
                            display: 'flex',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }, children: _jsx(Players, { names: names }) }), _jsxs(Box, { sx: {
                            width: 500,
                            height: 500,
                            marginTop: 8,
                            display: 'flex',
                            gap: '8px',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }, children: [_jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, children: "Game Lobby" }), _jsxs(Typography
                            // variant="black"
                            , { 
                                // variant="black"
                                component: "body", gutterBottom: true, children: ["Share this link to play with a friend - ", game.uuid] }), _jsx(Button, { variant: "contained", onClick: () => setGame((game) => {
                                    GameService.updateGame(game.uuid, {
                                        game_status: 'in_progress',
                                    });
                                    Object.assign(game, {
                                        game_status: 'in_progress',
                                    });
                                }), children: "Start Game" })] })] }) }) }));
};
const Players = ({ names }) => {
    return names.map((name) => {
        return (_jsxs(Typography, { component: "body", children: [' ', name, ' '] }));
    });
};
export default Lobby;
//# sourceMappingURL=lobby.js.map