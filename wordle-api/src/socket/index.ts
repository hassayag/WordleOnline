import WebSocket from 'ws';
import Config from '../../config'
import { Game } from '../api/game/types';
import { Room } from './room';

export const initWsServer = () => {
    const wss = new WebSocket.Server({ port: Config.websocket.port });

    const rooms = new Map<Game['uuid'], Room>()
    wss.on('connection', (socket, request) => {
        const {game: gameUuid, session: sessionToken} = getCookieAttributes(request.headers.cookie)

        let room = rooms.get(gameUuid)
        if (!room) {
            room = new Room(gameUuid)
            rooms.set(gameUuid, room)
        }

        room.addPlayer(sessionToken, socket)
    })

    console.info(`Websocket Server listening on port ${Config.websocket.port}`)
}

/** 
 * Convert cookie string into an object
 * cookie looks like "session=abcd-1234-efgh-5678 game=abcd-1234-efgh-5678;"  
 */
const getCookieAttributes = (cookieString: string): Record<'game' | 'session', string> => {
    const tokens = cookieString.split(' ')

    const output = {
        game: '',
        session: ''
    }

    tokens.forEach(token => {
        const [key, value] = token.split('=')
        value.replace(';', '')
        output[key] = value.replace(';', '')
    })

    return output
}