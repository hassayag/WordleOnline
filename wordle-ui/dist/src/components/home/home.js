import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Box, Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Typography, } from '@mui/material';
import { Home as HomeIcon, Add as AddIcon } from '@mui/icons-material';
import './home.css';
import { GameService } from '@/services/game-service';
import Game from '../game/game';
import CreateGame from './create-game/create-game';
const Navbar = () => {
    const [gameIds, setGameIds] = useState([]);
    const [routes, setRoutes] = useState({});
    const [navItems, setNavItems] = useState([]);
    const [drawerLinks, setDrawerLinks] = useState({});
    useEffect(() => {
        GameService.getGames()
            .then((response) => setGameIds(response.uuids))
            .catch((err) => console.error(err));
        setDrawerLinks({
            home: {
                label: 'Home',
                path: '/',
                component: _jsx(Home, {}),
                icon: _jsx(HomeIcon, { color: "primary" }),
            },
            create_game: {
                label: 'Create Game',
                path: '/game/create',
                component: _jsx(CreateGame, { setGameIds: setGameIds }),
                icon: _jsx(AddIcon, { color: "secondary" }),
            },
        });
        setRoutes({
            home: {
                path: '/',
                component: _jsx(Home, {}),
            },
            create_game: {
                path: '/game/create',
                component: _jsx(CreateGame, { setGameIds: setGameIds }),
            },
        });
    }, []);
    useEffect(() => {
        // add all gameId routes to links object
        const gameRoutes = {};
        gameIds.forEach((id) => {
            gameRoutes[`game_${id}`] = {
                path: `/game/${id}`,
                component: _jsx(Game, { uuid: id }),
            };
        });
        setRoutes((routes) => Object.assign(routes, gameRoutes));
        setNavItems(Object.keys(drawerLinks).map((key) => {
            const { path, label, icon } = drawerLinks[key];
            return (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { LinkComponent: Link, href: path, children: [_jsx(ListItemIcon, { children: icon }), _jsx(ListItemText, { primary: label })] }) }, key));
        }));
    }, [drawerLinks, gameIds]);
    if (!routes) {
        return;
    }
    return (_jsxs(_Fragment, { children: [_jsx(Routes, { children: Object.values(routes).map((item) => (_jsx(Route, { path: item.path, element: item.component }))) }), _jsx(Drawer, { variant: "permanent", anchor: "left", PaperProps: {
                    elevation: 24,
                    sx: {
                        backgroundColor: '#202020',
                    },
                }, children: _jsx(List, { children: navItems }) })] }));
};
const Home = () => {
    return (_jsx(Container, { component: "main", maxWidth: "sm", children: _jsx(Box, { sx: {
                width: 500,
                height: 500,
                marginTop: 8,
                display: 'flex',
                gap: '8px',
                flexDirection: 'column',
                alignItems: 'center',
            }, children: _jsx(Typography, { variant: "h4", component: "h1", gutterBottom: true, children: "Welcome to WordleOnline" }) }) }));
};
export default Navbar;
//# sourceMappingURL=home.js.map