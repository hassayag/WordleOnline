import { Game } from '../api/game/types';
import WebSocket from 'ws';

const EVENT_LIST = ['test', 'send_word', 'start_game'] as const;
type Event = (typeof EVENT_LIST)[number];

interface SocketResponse {
    event: Event,
    data?: string
} 

export class Room {
    gameUuid: string;
    roomId: string;
    game: Game

    constructor(gameUuid: string) {
        this.gameUuid = gameUuid;
        this.roomId = gameUuid.slice(0, 4);
    }

    // map session token with socket
    clients = new Map<string, WebSocket>();

    addPlayer(sessionToken: string, socket: WebSocket) {
        console.info(
            `Added player ${sessionToken.slice(0, 4)} to game ${this.roomId}`
        );

        socket.on('message', (msg) => {
            console.debug(`${this.roomId} received msg - `, msg.toString());
            const response = this.handleMessage(msg);
            socket.send(JSON.stringify(response))
        });

        socket.on('close', () => {
            this.removePlayer(sessionToken);
        });

        this.clients.set(sessionToken, socket);
    }

    private removePlayer(sessionToken: string) {
        console.info(
            `Removed player ${sessionToken.slice(0, 4)} from game ${
                this.roomId
            }`
        );
        this.clients.delete(sessionToken);
    }

    private handleMessage(msg: WebSocket.RawData) {
        const { event, data } = JSON.parse(msg.toString());

        if (!this.eventIsValid(event)) {
            console.warn(
                `[room:${this.roomId}] Received invalid event ${event}`
            );
            return;
        }

        console.debug(
            `[room:${this.roomId}] Received event ${event} with data ${data}`
        );

        let responseData;
        switch (event) {
            case 'send_word':
                responseData = this.handleSendWord(data);
                break;
            case 'start_game':
                responseData = this.handleStartGame();
                break;
        }

        return {event, data: responseData}
    }

    private handleSendWord(word: string) {
        // update game state with the word
        
        return this.game
    }

    private handleStartGame() {
        // this.game.game_status = 'in_progress'

        const response: SocketResponse = {
            event: 'start_game'
        }

        // tell all the clients that the game has started
        this.clients.forEach(client => {
            client.send(JSON.stringify(response))
        })

        return;
    }

    private eventIsValid(event): event is Event {
        return EVENT_LIST.includes(event);
    }
}

// multiple rooms open
// get socket connection -> assign that person to a room
// when a game for a certain room updates -> send update to all members of the room
// if someone joins/leaves the room -> send update
// when game is finished, delete room instance
