export interface Game {
    id: number,
    uuid: string,
    gameStatus: GameStatus,
    type: 'standard' | string,
    state: PlayerState[]
}

export interface PlayerState {
    player: Player,
    goalWord: string,
    board: {[key: number]: Letter[]},
    letterStates: {[key: string]: LetterColour}
}

export interface Player {
    name: string,
    sessionToken: string
}

export interface Letter {
    key: string,
    state: LetterColour
}

export enum LetterColour {
    White = 'white',
    Grey = 'grey',
    Yellow = 'yellow',
    Green = 'green'
}

export enum GameStatus {
    Lobby = 'lobby',
    InProgress = 'in_progress',
    Done = 'done'
}