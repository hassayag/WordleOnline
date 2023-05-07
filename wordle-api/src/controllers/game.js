import { v4 } from 'uuid';
import psql from '../utils/sql.js';
import { randomWord } from '../utils/words-util.js';

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
    const game = await _getGame(req.params.uuid);

    res.send(game);
};

export const createGame = async (req, res) => {
    const newPlayer = (name) => {
            return {
                name,
                client: {},
            };
        },
        randWord = await randomWord();

    const uuid = v4(),
        state = JSON.stringify([
            {
                player: newPlayer(req.body.name),
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
            'INSERT INTO game (uuid, type, state) values ($1, $2, $3)',
            [uuid, req.body.type, state]
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
    game.state[0] = req.body.state; // TODO: ACTUALLY ASSIGN TO CORRECT USER

    try {
        await psql().query('UPDATE game SET state = $1 WHERE uuid = $2', [
            JSON.stringify(game.state),
            req.params.uuid,
        ]);
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

    return game;
};
