import { v4 } from 'uuid';

import { randomWord } from '../utils/words-util';
import db from './db-utils';
import {
    CreateGameReq,
    Game,
    GameStatus,
    JoinGameReq,
    PlayerState,
    UpdateGameReq,
} from './types';
import { BadRequestError, NotFoundError } from '../error';
import { findStateIndex, initialState, formatReturnedGame } from './utils';

// get uuids of all games
export const getUuids = async (req, res) => {
    res.send(await db.getUuids());
};

export const getGame = async (req, res) => {
    const game: Game = await db.get(req.params.uuid);

    const playerStateIndex = findStateIndex(game, req.cookies.session);
    if (playerStateIndex === -1) {
        throw new NotFoundError('Game not found');
    }

    const returnedGame = formatReturnedGame(game, req.cookies.session)
    res.send(returnedGame);
};

export const createGame = async (req: CreateGameReq, res) => {
    if (!req.cookies?.session) {
        throw new BadRequestError('Session token not found');
    }

    const randWord = await randomWord();

    const uuid: string = v4(),
        game_status: GameStatus = 'lobby',
        state: PlayerState[] = [
            initialState(req.body.name, req.cookies.session, randWord),
        ];

    const game = await db.create({
        uuid,
        game_status,
        type: req.body.type,
        state,
    });

    const returnedGame = formatReturnedGame(game, req.cookies.session)
    res.send(returnedGame);
};

export const updateGame = async (req: UpdateGameReq, res) => {
    // assign the user's game state to the correct part of state object
    const game = await db.get(req.params.uuid);

    const playerStateIndex = findStateIndex(game, req.cookies.session);
    if (playerStateIndex === -1 && game.game_status !== 'lobby') {
        throw new BadRequestError('Game not found');
    }
    if (req.body.player_state) {
        console.log(playerStateIndex, req.body.player_state)
        game.state[playerStateIndex] = req.body.player_state;
    }
    if (req.body.game_status) {
        game.game_status = req.body.game_status;
    }

    const newGame = await db.update(game);

    const returnedGame = formatReturnedGame(newGame, req.cookies.session)
    res.send(returnedGame);
};

export const joinGame = async (req: JoinGameReq, res) => {
    const game = await db.get(req.params.uuid);

    const playerStateIndex = findStateIndex(game, req.cookies.session);

    // player is already in the game, just let them in
    if (playerStateIndex !== -1) {
        const returnedGame = formatReturnedGame(game, req.cookies.session)
        res.send(returnedGame);
        return
    }

    // if still in lobby state, add player to game
    if (game.game_status === 'lobby') {
        const newPlayerState = initialState(
            req.body.name,
            req.cookies.session,
            game.state[0].goalWord
        );
        const updateOptions: Game = Object.assign(game, {
            state: [...game.state, newPlayerState],
        });
        const updatedGame = await db.update(updateOptions);
        res.send(updatedGame);
    } else {
        throw new BadRequestError('Game has already started');
    }
};
