'use client'

import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'next/router';
import {
    Box,
    Container,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    Typography,
} from '@mui/material';
import { Home as HomeIcon, Add as AddIcon } from '@mui/icons-material';

import './home.css';
import { GameService } from '@/services/game-service';
import Game from '../game/game';
import CreateGame from '@/app/game/create/page';

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
                component: <Home />,
                icon: <HomeIcon color="primary" />,
            },
            create_game: {
                label: 'Create Game',
                path: '/game/create',
                component: <CreateGame setGameIds={setGameIds} />,
                icon: <AddIcon color="secondary" />,
            },
        });

        setRoutes({
            home: {
                path: '/',
                component: <Home />,
            },
            create_game: {
                path: '/game/create',
                component: <CreateGame setGameIds={setGameIds} />,
            },
        });
    }, []);

    useEffect(() => {
        // add all gameId routes to links object
        const gameRoutes = {};

        gameIds.forEach((id) => {
            gameRoutes[`game_${id}`] = {
                path: `/game/${id}`,
                component: <Game uuid={id} />,
            };
        });

        setRoutes((routes) => Object.assign(routes, gameRoutes));

        setNavItems(
            Object.keys(drawerLinks).map((key) => {
                const { path, label, icon } = drawerLinks[key];
                
                return (
                    <ListItem key={key} disablePadding>
                        <ListItemButton LinkComponent={Link} to={path}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItemButton>
                    </ListItem>
                );
            })
        );
    }, [drawerLinks, gameIds]);

    if (!routes) {
        return (<div>loading</div>);
    }

    return (
        <>
            {/* <Routes>
                {Object.values(routes).map((item) => (
                    <Route path={item.path} element={item.component} />
                ))}
            </Routes> */}

            <Drawer
                variant="permanent"
                anchor="left"
                PaperProps={{
                    elevation: 24,
                    sx: {
                        backgroundColor: '#483248',
                    },
                }}
            >
                <List>{navItems}</List>
            </Drawer>
        </>
    );
};

const Home = () => {
    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    width: 500,
                    height: 500,
                    marginTop: 8,
                    display: 'flex',
                    gap: '8px',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to WordleOnline
                </Typography>
            </Box>
        </Container>
    );
};

export default Navbar;
