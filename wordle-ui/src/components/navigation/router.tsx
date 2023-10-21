import GameService from '@/services/game-service';
import {
    Add as AddIcon,
    Home as HomeIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateGame from '../create-game/create-game';
import Game from '../game/game';
import Home from '../home/home';
import JoinGame from '../join-game/join-game';
import Navbar from './navbar';

interface RouteItem {
    path: string;
    component: React.JSX.Element;
}

export interface DrawerItem {
    label: string;
    path: string;
    icon: any;
}

const MyRouter = () => {
    const [gameUuids, setGameUuids] = useState<string[]>([]);
    const [routes, setRoutes] = useState<Record<string, RouteItem>>({});
    const [drawerLinks, setDrawerLinks] = useState<Record<string, DrawerItem>>(
        {}
    );
    const [componentMap, setComponentMap] = useState<Record<string, React.JSX.Element>>({
        home: <Home />,
        create_game: (
            <CreateGame gameUuids={gameUuids} setGameUuids={setGameUuids} />
        ),
        join_game: <JoinGame />,
    })

    useEffect(() => {
        GameService.getGames()
        .then((response) => {
            setGameUuids(response.uuids);
        })
        .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        const initDrawerLinks: Record<string, DrawerItem> = {
            home: {
                label: 'Home',
                path: '/',
                icon: <HomeIcon color="primary" />,
            },
            create_game: {
                label: 'Create Game',
                path: '/game/create',
                icon: <AddIcon color="secondary" />,
            },
            join_game: {
                label: 'Join Game',
                path: '/game/join',
                icon: <PeopleIcon color="secondary" />,
            },
        };
        setDrawerLinks(initDrawerLinks);
    }, []);

    useEffect(() => {
        const initRoutes: Record<string, RouteItem> = {};
        Object.entries(drawerLinks).forEach(([key, value]) => {
            initRoutes[key] = {
                path: value.path,
                component: componentMap[key],
            };
        });
        setRoutes(initRoutes);
    }, [componentMap, drawerLinks])

    useEffect(() => {
        // add all gameId routes to links object
        const gameRoutes: Record<string, RouteItem> = {};

        gameUuids.forEach((id) => {
            gameRoutes[`game_${id}`] = {
                path: `/game/${id}`,
                component: <Game uuid={id} />,
            };
        });

        setRoutes(routes => Object.assign(routes,gameRoutes));

        setComponentMap({
            home: <Home />,
            create_game: (
                <CreateGame gameUuids={gameUuids} setGameUuids={setGameUuids} />
            ),
            join_game: <JoinGame />,
        })
    }, [gameUuids, routes]);

    if (!routes) {
        return <></>;
    }
    return (
        <>
            <Navbar drawerLinks={drawerLinks} />
            <BrowserRouter>
                <Routes>
                    {Object.entries(routes).map(([key, item]) => (
                        <Route
                            key={key}
                            path={item.path}
                            element={item.component}
                        />
                    ))}
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default MyRouter;
