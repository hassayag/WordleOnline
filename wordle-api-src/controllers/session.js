const { v4 } = require('uuid');
const psql = require('../utils/sql')

module.exports.get = async (req, res) => {
    const sessionToken = req.params.token;

    const sessions = await _getSession(sessionToken);

    if (!sessions.length) {
        res.status(404).send('Session not found');
    }

    res.send(sessions[0]);
}

module.exports.create = async (req, res) => {
    const MILISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

    const { name, gameId } = req.body,
        sessionToken = v4(),
        expiresAt = Date.now() + MILISECONDS_IN_A_DAY;

    if (!name) {
        res.status(400).send("'name' is required");
    }
    
    if (!gameId) {
        res.status(400).send("'game id' is required");
    }

    try {
        await psql().query('INSERT INTO session (name, session_token, game_id, expires_at) values ($1, $2, $3, $4)', [name, sessionToken, gameId, expiresAt]);
    }
    catch (err) {
        throw new Error(err.stack);
    }

    const sessions = await _getSession(sessionToken);

    res.send(sessions[0])
}

module.exports.delete = async (req, res) => {
    const { sessionToken } = req.body;

    try {
        await psql().query('DELETE FROM session WHERE session_token = $1', [sessionToken]);
    }
    catch (err) {
        throw new Error(err.stack);
    }

    res.send()
}

async function _getSession (req, res) {
    let sessions;

    try {
        sessions = await psql().query('SELECT * from session where session_token = $1 and expires_at > $2', [sessionToken, Date.now()]);
    }
    catch (err) {
        throw new Error(err.stack);
    }

    return sessions;
}