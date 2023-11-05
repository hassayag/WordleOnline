import { Server } from 'https';
import WebSocket from 'ws';
import { Game } from '../api/game/types';
import { Room } from './room';

export const initWsServer = (server: Server) => {
    const wss = new WebSocket.Server({ server });

    const rooms = new Map<Game['uuid'], Room>();
    wss.on('connection', (socket, request) => {
        const { game: gameUuid, session: sessionToken } = getQueryAttrs(
            request.url
        );
        let room = rooms.get(gameUuid);
        if (!room) {
            room = new Room(gameUuid);
            rooms.set(gameUuid, room);
        }

        room.addPlayer(sessionToken, socket);
    });
};

/**
 * Convert cookie string into an object
 * cookie looks like "session=abcd-1234-efgh-5678 game=abcd-1234-efgh-5678;"
 */
const getQueryAttrs = (
    queryString: string
): Record<'game' | 'session', string> => {
    const noPrefix = queryString.replace('/?', '');
    const tokens = noPrefix.split('&');

    const output = {
        game: '',
        session: '',
    };

    tokens.forEach((token) => {
        const [key, value] = token.split('=');
        output[key] = value;
    });

    return output;
};
