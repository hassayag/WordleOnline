import { v4 } from 'uuid';

import { randomWord } from '../utils/words-util';
import db from './db-utils';
import { CreateGameReq, Game, GameStatus, JoinGameReq, LetterColour, PlayerState, UpdateGameReq } from './types';

// get uuids of all games
export const getUuids = async (req, res) => {
    res.send(await db.getUuids());
};

export const getGame = async (req, res) => {
    const game: Game = await db.get(req.params.uuid);

    if (game.game_status !== GameStatus.Lobby) {
        const playerState = game.state.find(
            (item) => item.player.sessionToken === req.cookies.session
        );
        if (!playerState) {
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

    const newPlayer = (name, sessionToken) => {
            return {
                name,
                sessionToken,
            };
        },
        randWord = await randomWord();

    const uuid: string = v4(),
        game_status: GameStatus = GameStatus.Lobby,
        state: PlayerState[]  = [
            {
                player: newPlayer(req.body.name, req.cookies.session),
                goalWord: randWord,
                board: {
                    0: [],
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                },
                letterStates: {
                    a: LetterColour.White,
                    b: LetterColour.White,
                    c: LetterColour.White,
                    d: LetterColour.White,
                    e: LetterColour.White,
                    f: LetterColour.White,
                    g: LetterColour.White,
                    h: LetterColour.White,
                    i: LetterColour.White,
                    j: LetterColour.White,
                    k: LetterColour.White,
                    l: LetterColour.White,
                    m: LetterColour.White,
                    n: LetterColour.White,
                    o: LetterColour.White,
                    p: LetterColour.White,
                    q: LetterColour.White,
                    r: LetterColour.White,
                    s: LetterColour.White,
                    t: LetterColour.White,
                    u: LetterColour.White,
                    v: LetterColour.White,
                    w: LetterColour.White,
                    x: LetterColour.White,
                    y: LetterColour.White,
                    z: LetterColour.White,
                },
            },
        ];

    const game = await db.create({uuid, game_status, type: req.body.type, state});

    res.send(game);
};

export const updateGame = async (req: UpdateGameReq, res) => {
    // assign the user's game state to the correct part of state object
    const game = await db.get(req.params.uuid);

    if (game.game_status !== GameStatus.Lobby) {
        const playerState = game.state.find(
            (item) => item.player.sessionToken === req.cookies.session
        );
        if (!playerState) {
            res.status(404).send('Game not found');
            return;
        }
    }

    if (req.body.state) {
        game.state[0] = req.body.state; // TODO: ACTUALLY ASSIGN TO CORRECT USER
    }
    if (req.body.game_status) {
        game.game_status = req.body.game_status;
    }

    const newGame = await db.update(game);

    res.send(newGame);
};

export const joinGame = async (req: JoinGameReq, res) => {
    const game = await db.get(req.params.uuid);

    if (game.game_status !== GameStatus.Lobby) {
        res.status(400).send('Game has already started');
        return;
    }
}

