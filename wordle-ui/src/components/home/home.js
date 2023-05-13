import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, Typography } from '@mui/material'
import { Home as HomeIcon, Add as AddIcon } from '@mui/icons-material';

import './home.css';
import { GameService } from 'services/game-service';
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
                component: <Home/>,
                icon: <HomeIcon color="primary"/>
            },
            create_game: {
                label: 'Create Game',
                path: '/game/create',
                component: <CreateGame setGameIds={setGameIds}/>,
                icon: <AddIcon color="secondary"/>
            }
        });
        
        setRoutes({
            home: {
                path: '/',
                component: <Home/>,
            },
            create_game: {
                path: '/game/create',
                component: <CreateGame setGameIds={setGameIds}/>,
            }
        });
    }, [])

    useEffect(() =>{
        // add all gameId routes to links object
        const gameRoutes = {};

        gameIds.forEach(id => {
            gameRoutes[`game_${id}`] = {
                path: `/game/${id}`,
                component: <Game uuid={id} />
            }
        })

        setRoutes(routes => Object.assign(routes, gameRoutes));

        setNavItems(Object.keys(drawerLinks).map((key) => {
                const { path, label, icon } = drawerLinks[key];

                return (<ListItem key={key} disablePadding>
                    <ListItemButton LinkComponent={Link} to={path}>
                        <ListItemIcon>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={label} />
                    </ListItemButton>
                </ListItem>)
            })
        )


    }, [gameIds]);

    if (!routes) {
        return;
    }

    return (
        <>
            <Routes>
                {Object.values(routes).map(item => <Route path={item.path} element={item.component} />)}
            </Routes>

            <Drawer
                variant="permanent"
                anchor="left"
                PaperProps={{
                    sx: {
                        backgroundColor: "#696969"
                    }
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
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to WordleOnline
            </Typography>
        </Container>
    );
};

export default Navbar;
