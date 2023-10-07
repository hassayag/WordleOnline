import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
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
import { Home as HomeIcon, Add as AddIcon, People as PeopleIcon } from '@mui/icons-material';

import './home.css';
import { GameService } from '@/services/game-service';
import Game from '../game/game';
import CreateGame from './create-game/create-game';
import React from 'react';
import JoinGame from './join-game/join-game';

interface RouteItem {
    path: string,
    component: React.JSX.Element
}

interface DrawerItem {
    label: string;
    path: string;
    component: React.JSX.Element
    icon: any
}

const Navbar = () => {
    const [gameIds, setGameIds] = useState<number[]>([]);
    const [routes, setRoutes] = useState<Record<string, RouteItem>>({});
    const [navItems, setNavItems] = useState([]);
    const [drawerLinks, setDrawerLinks] = useState<Record<string, DrawerItem>>({});

    useEffect(() => {
        GameService.getGames()
            .then((response) => setGameIds(response.uuids))
            .catch((err) => console.error(err));

        const initDrawerLinks: Record<string, DrawerItem> = {
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
            join_game: {
                label: 'Join Game',
                path: '/game/join',
                component: <JoinGame />,
                icon: <PeopleIcon color="secondary" />,
            },
        }
        setDrawerLinks(initDrawerLinks);

        const initRoutes: Record<string, RouteItem> = {}
         Object.entries(initDrawerLinks).forEach(([key, value]) => {
            initRoutes[key] = {
                path: value.path,
                component: value.component
            }
        })
        setRoutes(initRoutes)
        
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
                        <ListItemButton href={path}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={label}/>
                        </ListItemButton>
                    </ListItem>
                );
            })
        );
    }, [drawerLinks, gameIds]);

    if (!routes) {
        return;
    }

    return (
        <>
            <Routes>
                {Object.values(routes).map((item) => (
                    <Route path={item.path} element={item.component} />
                ))}
            </Routes>

            <Drawer
                variant="permanent"
                anchor="left"
                PaperProps={{
                    elevation: 24,
                    sx: {
                        backgroundColor: '#eeeeee',
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
        <main>
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    width: 500,
                    height: 500,
                    marginTop: 8,
                    marginLeft: '50%',
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
        </main>
    );
};

export default Navbar;
