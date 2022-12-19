const { v4 } = require('uuid');
const psql = require('../utils/sql')

module.exports.get = async (req, res) => {
    let games;

    try {
        games = await psql().query('SELECT uuid from game');
    }
    catch (err) {
        throw new Error(err.stack);
    }

    res.send({uuids: games.rows.map(game => game.uuid)});
}

module.exports.create = async (req, res) => {
    const newPlayer = (name) => {
        return {
            name,
            client: {}
        }
    }

    const uuid = v4(),
        state = JSON.stringify([{
            player: newPlayer(req.body.name),
            board: {
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: []
            }
        }]);

    try {
        await psql().query('INSERT INTO game (uuid, type, state) values ($1, $2, $3)', [uuid, req.body.type, state]);
    }
    catch (err) {
        throw new Error(err.stack);
    }

    res.send({uuid})
}
