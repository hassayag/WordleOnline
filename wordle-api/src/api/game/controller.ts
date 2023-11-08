import { v4 } from 'uuid';
import { Request, Response } from 'express';
import { randomWord } from '../words/utils';
import db from './db-utils';
import {
    CreateGameReq,
    Game,
    GameStatus,
    JoinGameReq,
    PlayerState,
    RestartGameReq,
    UpdateGameReq,
} from './types';
import { BadRequestError } from '../../error';
import { findStateIndex, initialState, formatReturnedGame } from './utils';
import { GameService } from '../../services/game';

// get uuids of all games
export const getUuids = async (req: Request, res: Response) => {
    res.send(await db.getUuids());
};

export const getGame = async (req, res) => {
    const session = req.headers.authorization.replace('Bearer ', '');
    if (!session) {
        throw new BadRequestError('Session token not found');
    }

    const game = await GameService.getGame(req.params.uuid, session);

    const returnedGame = formatReturnedGame(game, session);
    res.send(returnedGame);
};

export const createGame = async (req: CreateGameReq, res) => {
    const session = req.headers.authorization.replace('Bearer ', '');
    if (!session) {
        throw new BadRequestError('Session token not found');
    }

    const randWord = await randomWord();

    const uuid: string = v4(),
        game_status: GameStatus = 'lobby',
        state: PlayerState[] = [initialState(req.body.name, session, randWord)];

        const game = await db.create({
        uuid,
        game_status,
        type: req.body.type,
        state,
    });

    const returnedGame = formatReturnedGame(game, session);
    res.send(returnedGame);
};

export const updateGame = async (req: UpdateGameReq, res) => {
    const session = req.headers.authorization.replace('Bearer ', '');
    if (!session) {
        throw new BadRequestError('Session token not found');
    }

    const newGame = await GameService.updateGame(req.body, session);

    const returnedGame = formatReturnedGame(newGame, session);
    res.send(returnedGame);
};

export const joinGame = async (req: JoinGameReq, res) => {
    const session = req.headers.authorization.replace('Bearer ', '');
    if (!session) {
        throw new BadRequestError('Session token not found');
    }
    
    const game = await db.get(req.params.uuid);

    const playerStateIndex = findStateIndex(game, session);

    // player is already in the game, just let them in
    if (playerStateIndex !== -1) {
        const returnedGame = formatReturnedGame(game, session);
        res.send(returnedGame);
        return;
    }

    // if still in lobby state, add player to game
    if (game.game_status === 'lobby') {
        const newPlayerState = initialState(
            req.body.name,
            session,
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
