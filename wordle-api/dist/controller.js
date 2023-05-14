var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 } from 'uuid';
import psql from '../utils/sql.js';
import { randomWord } from '../utils/words-util.js';
// get uuids of all games
export const getUuids = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let games;
    try {
        games = yield psql().query('SELECT uuid from game');
    }
    catch (err) {
        throw new Error(err.stack);
    }
    res.send({ uuids: games.rows.map((game) => game.uuid) });
});
export const getGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield _getGame(req.params.uuid);
    if (game.game_status !== 'lobby') {
        const playerState = game.state.find(item => item.player.sessionToken === req.cookies.session);
        if (!playerState) {
            res.status(404).send('Game not found');
            return;
        }
    }
    res.send(game);
});
export const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.session)) {
        res.status(400).send('Session token not found');
        return;
    }
    const newPlayer = (name, sessionToken) => {
        return {
            name,
            sessionToken
        };
    }, randWord = yield randomWord();
    const uuid = v4(), gameStatus = 'lobby', state = JSON.stringify([
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
        yield psql().query('INSERT INTO game (uuid, game_status, type, state) values ($1, $2, $3, $4)', [uuid, gameStatus, req.body.type, state]);
    }
    catch (err) {
        throw new Error(err.stack);
    }
    const game = yield _getGame(uuid);
    res.send(game);
});
export const updateGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // assign the user's game state to the correct part of state object
    const game = yield _getGame(req.params.uuid);
    if (game.game_status !== 'lobby') {
        const playerState = game.state.find(item => item.player.sessionToken === req.cookies.session);
        if (!playerState) {
            res.status(404).send('Game not found');
            return;
        }
    }
    if (req.body.state) {
        game.state[0] = req.body.state; // TODO: ACTUALLY ASSIGN TO CORRECT USER
    }
    if (req.body.gameStatus) {
        game.game_status = req.body.gameStatus;
    }
    try {
        yield psql().query('UPDATE game SET state = $1, game_status = $3 WHERE uuid = $2', [JSON.stringify(game.state), game.uuid, game.game_status]);
    }
    catch (err) {
        throw new Error(err.stack);
    }
    const newGame = yield _getGame(req.params.uuid);
    res.send(newGame);
});
const _getGame = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    let rawGame;
    try {
        rawGame = yield psql().query('SELECT * FROM game WHERE uuid = $1', [
            uuid,
        ]);
    }
    catch (err) {
        throw new Error(err.stack);
    }
    // get row and parse state to JSON
    const game = rawGame.rows[0];
    game.state = JSON.parse(game.state);
    return game;
});
//# sourceMappingURL=controller.js.map