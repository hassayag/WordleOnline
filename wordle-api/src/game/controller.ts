import { v4 } from 'uuid';

import { randomWord } from '../utils/words-util';
import db from './db-utils';
import { CreateGameReq, Game, GameStatus, JoinGameReq, LetterColour, PlayerState, UpdateGameReq } from './types';
import { NextFunction } from 'express';

// get uuids of all games
export const getUuids = async (req, res) => {
    res.send(await db.getUuids());
};

export const getGame = async (req, res) => {
    const game: Game = await db.get(req.params.uuid);

    if (game.game_status !== 'lobby') {
        const playerState = findStateIndex(game, req.cookies.session)
        if (playerState === -1) {
            res.status(404).send('Game not found');
            return;
        }
    }

    res.send(game);
};

export const createGame = async (req: CreateGameReq, res) => {
    if (!req.cookies?.session) {
        res.status(400).send('Session token not found');
        return;
    }
    
    const randWord = await randomWord();

    const uuid: string = v4(),
        game_status: GameStatus = 'lobby',
        state: PlayerState[]  = [initialState(req.body.name, req.cookies.session, randWord)];

    const game = await db.create({uuid, game_status, type: req.body.type, state});

    res.send(game);
};

export const updateGame = async (req: UpdateGameReq, res) => {
    // assign the user's game state to the correct part of state object
    const game = await db.get(req.params.uuid);
    
    const playerStateIndex = findStateIndex(game, req.cookies.session)
    if (playerStateIndex === -1 && game.game_status !== 'lobby') {
        res.status(404).send('Game not found');
        return;
    }
    if (req.body.player_state) {
        game.state[playerStateIndex] = req.body.player_state;
    }
    if (req.body.game_status) {
        game.game_status = req.body.game_status;
    }

    const newGame = await db.update(game);
    
    res.send(newGame);
};

export const joinGame = async (req: JoinGameReq, res) => {
    const game = await db.get(req.params.uuid);

    const playerStateIndex = findStateIndex(game, req.cookies.session)
    if (playerStateIndex !== -1) {
        return
    }

    if (game.game_status !== 'lobby') {
        res.status(400).send('Game has already started');
        return;
    }

    const newPlayerState = initialState(req.body.name, req.cookies.session, game.state[0].goalWord)
    const updatedGame: Game = Object.assign(game, { state: [...game.state, newPlayerState]})
    await db.update(updatedGame)
}

const initialState = (name: string, sessionToken: string, word: string): PlayerState => {
    return {
        player: newPlayer(name, sessionToken),
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
    }
}

const findStateIndex = (game: Game, sessionToken: string) => {
    return game.state.findIndex(
        (item) => item.player.sessionToken === sessionToken
    );
}

const newPlayer = (name, sessionToken) => {
    return {
        name,
        sessionToken,
    };
}