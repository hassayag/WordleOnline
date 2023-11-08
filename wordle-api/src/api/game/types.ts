import { Request } from 'express';

export interface Game {
    id: number;
    uuid: string;
    game_status: GameStatus;
    type: 'standard' | string;
    state: PlayerState[];
}

export interface PlayerState {
    player: Player;
    // null indicates the game has not ended
    isWon: boolean | null;
    goalWord: string;
    board: { [key: number]: Letter[] };
    letterStates: { [key: string]: LetterColour };
}

export interface Player {
    name: string;
    sessionToken: string;
}

export interface Letter {
    key: string;
    state: LetterColour;
}

export type LetterColour = 'white' | 'grey' | 'yellow' | 'green';

export type GameStatus = 'lobby' | 'in_progress' | 'done';

// Request Interfaces
export interface CreateGameReq extends Request {
    body: {
        name: string;
        type: string;
    };
}
export interface UpdateGameReq extends Request {
    body: {
        player_state: PlayerState | null;
        game_status: GameStatus;
        uuid: string;
    };
}

export interface JoinGameReq extends Request {
    params: {
        uuid: string
    },
    body: {
        name: string;
    };
}

export interface RestartGameReq extends Request {
    params: {
        uuid: string
    }
}
