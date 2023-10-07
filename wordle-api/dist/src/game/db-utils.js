import psql from '../utils/sql';
class GameDbUtils {
    static async get(uuid) {
        let rawGame;
        try {
            rawGame = await psql().query('SELECT * FROM game WHERE uuid = $1', [
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
    }
    ;
    static async getUuids() {
        let games;
        try {
            games = await psql().query('SELECT uuid from game');
            console.log(games);
        }
        catch (err) {
            throw new Error(err.stack);
        }
        return { uuids: games.rows.map((game) => game.uuid) };
    }
    ;
    static async create(options) {
        const { state, uuid, game_status, type } = options;
        try {
            await psql().query('INSERT INTO game (uuid, game_status, type, state) values ($1, $2, $3, $4)', [uuid, game_status, type, JSON.stringify(state)]);
        }
        catch (err) {
            throw new Error(err.stack);
        }
        return await this.get(uuid);
    }
    static async update(options) {
        const { state, uuid, game_status } = options;
        try {
            await psql().query('UPDATE game SET state = $1, game_status = $3 WHERE uuid = $2', [JSON.stringify(state), uuid, game_status]);
        }
        catch (err) {
            throw new Error(err.stack);
        }
        return await this.get(uuid);
    }
}
export default GameDbUtils;
//# sourceMappingURL=db-utils.js.map