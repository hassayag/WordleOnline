import { Game, PlayerState } from "./types";

interface ReturnedGame extends Omit<Game, 'state'> {
    myState: PlayerState,
    otherStates: PlayerState[]
}

export function formatReturnedGame(game: Game, sessionToken: string): ReturnedGame {
    const {state, ...gameWithoutState} = game
    
    const myStateIndex = findStateIndex(game, sessionToken)
    const myState = state[myStateIndex]
    const otherStates = state.filter((value, index) => index !== myStateIndex)

    // cleanse session tokens from other states as it is sensitive information
    otherStates.forEach(state => state.player.sessionToken = 'nice-try-mate')

    return {
        ...gameWithoutState,
        myState,
        otherStates
    }
    
}

export function initialState(
    name: string,
    sessionToken: string,
    word: string
): PlayerState {
    return {
        player: newPlayer(name, sessionToken),
        isWon: null,
        goalWord: word,
        board: {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
        },
        letterStates: {
            a: 'white',
            b: 'white',
            c: 'white',
            d: 'white',
            e: 'white',
            f: 'white',
            g: 'white',
            h: 'white',
            i: 'white',
            j: 'white',
            k: 'white',
            l: 'white',
            m: 'white',
            n: 'white',
            o: 'white',
            p: 'white',
            q: 'white',
            r: 'white',
            s: 'white',
            t: 'white',
            u: 'white',
            v: 'white',
            w: 'white',
            x: 'white',
            y: 'white',
            z: 'white',
        },
    };
}

export function findStateIndex(game: Game, sessionToken: string) {
    return game.state.findIndex(
        (item) => item.player.sessionToken === sessionToken
    )
}

export function newPlayer(name, sessionToken){
    return {
        name,
        sessionToken,
    }
}