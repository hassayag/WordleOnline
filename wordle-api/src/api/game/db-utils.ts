import { Game } from './types';
import db from '../../db/db';
import { NotFoundError } from '../../error';

class GameDbUtils {
    static async get(uuid: string) {
        const rawGame = await db().query('SELECT * FROM game WHERE uuid = $1', [
            uuid,
        ]);

        if (!rawGame?.rows?.length) {
            throw new NotFoundError(`Game uuid ${uuid} not found`);
        }

        // get row and parse state to JSON
        const game = rawGame.rows[0];
        game.state = JSON.parse(game.state);

        return game as Game;
    }

    static async getUuids() {
        const games = await db().query('SELECT uuid from game');
        return { uuids: games.rows.map((game) => game.uuid) };
    }

    static async create(options: Omit<Game, 'id'>) {
        const { state, uuid, game_status, type } = options;

        await db().query(
            'INSERT INTO game (uuid, game_status, type, state) values ($1, $2, $3, $4)',
            [uuid, game_status, type, JSON.stringify(state)]
        );

        return await this.get(uuid);
    }

    static async update(options: Game) {
        const { state, uuid, game_status } = options;

        await db().query(
            'UPDATE game SET state = $1, game_status = $3 WHERE uuid = $2',
            [JSON.stringify(state), uuid, game_status]
        );

        return await this.get(uuid);
    }
}

export default GameDbUtils;
