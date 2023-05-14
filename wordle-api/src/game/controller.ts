import { v4 } from 'uuid';
import psql from '../utils/sql';
import { randomWord } from '../utils/words-util';
import { Game, GameStatus } from './types'

// get uuids of all games
export const getUuids = async (req, res) => {
    let games;

    try {
        games = await psql().query('SELECT uuid from game');
    } catch (err) {
        throw new Error(err.stack);
    }

    res.send({ uuids: games.rows.map((game) => game.uuid) });
};

export const getGame = async (req, res) => {
    const game: Game = await _getGame(req.params.uuid);
    
    if (game.gameStatus !== GameStatus.Lobby) {
        const playerState = game.state.find(item => item.player.sessionToken === req.cookies.session);
        if (!playerState) {
            res.status(404).send('Game not found')
            return;
        }
    }
    
    res.send(game);
};

export const createGame = async (req, res) => {
    if (!req.cookies?.session) {
        res.status(400).send('Session token not found');
        return;
    }

    const newPlayer = (name, sessionToken) => {
            return {
                name,
                sessionToken
            };
        },
        randWord = await randomWord();

    const uuid = v4(),
        gameStatus = 'lobby',
        state = JSON.stringify([
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
            },
        ]);

    try {
        await psql().query(
            'INSERT INTO game (uuid, gameStatus, type, state) values ($1, $2, $3, $4)',
            [uuid, gameStatus, req.body.type, state]
        );
    } catch (err) {
        throw new Error(err.stack);
    }

    const game = await _getGame(uuid);

    res.send(game);
};

export const updateGame = async (req, res) => {
    // assign the user's game state to the correct part of state object
    const game = await _getGame(req.params.uuid);

    if (game.gameStatus !== GameStatus.Lobby) {
        const playerState = game.state.find(item => item.player.sessionToken === req.cookies.session);
        if (!playerState) {
            res.status(404).send('Game not found')
            return;
        }
    }

    if (req.body.state) {
        game.state[0] = req.body.state; // TODO: ACTUALLY ASSIGN TO CORRECT USER
    }
    if (req.body.gameStatus) {
        game.gameStatus = req.body.gameStatus;
    }

    try {
        await psql().query(
            'UPDATE game SET state = $1, gameStatus = $3 WHERE uuid = $2',
            [JSON.stringify(game.state), game.uuid, game.gameStatus]
        );
    } catch (err) {
        throw new Error(err.stack);
    }

    const newGame = await _getGame(req.params.uuid);

    res.send(newGame);
};

const _getGame = async (uuid) => {
    let rawGame;

    try {
        rawGame = await psql().query('SELECT * FROM game WHERE uuid = $1', [
            uuid,
        ]);
    } catch (err) {
        throw new Error(err.stack);
    }

    // get row and parse state to JSON
    const game = rawGame.rows[0];
    game.state = JSON.parse(game.state);

    return game as Game;
};
