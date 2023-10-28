import WebSocket from 'ws';

export class Room {
    gameUuid: string

    constructor(gameUuid: string) {
        this.gameUuid = gameUuid
    }
    // map session token with socket
    clients = new Map<string, WebSocket>();

    addPlayer(sessionToken: string, socket: WebSocket) {
        console.info(`Added player ${sessionToken} to game ${this.gameUuid}`)
        this.clients.set(sessionToken, socket)
    }
    removePlayer(sessionToken: string) {
        console.info(`Removed player ${sessionToken} from game ${this.gameUuid}`)
        this.clients.delete(sessionToken)
    }
}

// multiple rooms open
// get socket connection -> assign that person to a room
// when a game for a certain room updates -> send update to all members of the room
// if someone joins/leaves the room -> send update
// when game is finished, delete room instance