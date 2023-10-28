export interface Game {
    id: number;
    uuid: string;
    game_status: GameStatus;
    type: 'standard' | string;
    myState: PlayerState;
    otherStates: PlayerState[]
}

export type GameStatus = 'lobby' | 'in_progress' | 'done';

export interface PlayerState {
    player: Player;
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
    isError?: boolean;
}

export type LetterColour = 'white' | 'grey' | 'yellow' | 'green';
