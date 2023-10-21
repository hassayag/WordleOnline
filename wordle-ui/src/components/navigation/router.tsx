import GameService from '@/services/game-service';
import { Home } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import CreateGame from '../create-game/create-game';
import Game from '../game/game';
import JoinGame from '../join-game/join-game';
import {
    Home as HomeIcon,
    Add as AddIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
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

    const componentMap: Record<string, React.JSX.Element> = {
        home: <Home />,
        create_game: (
            <CreateGame gameUuids={gameUuids} setGameUuids={setGameUuids} />
        ),
        join_game: <JoinGame />,
    };

    useMemo(() => {
        GameService.getGames().then((response) => {
            setGameUuids(response.uuids);
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

            const initRoutes: Record<string, RouteItem> = {};
            Object.entries(initDrawerLinks).forEach(([key, value]) => {
                initRoutes[key] = {
                    path: value.path,
                    component: componentMap[key],
                };
            });
            setRoutes(initRoutes);
        });
    }, []);

    useMemo(() => {
        // add all gameId routes to links object
        const gameRoutes: Record<string, RouteItem> = {};

        gameUuids.forEach((id) => {
            gameRoutes[`game_${id}`] = {
                path: `/game/${id}`,
                component: <Game uuid={id} />,
            };
        });

        setRoutes(Object.assign(routes, gameRoutes));
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
