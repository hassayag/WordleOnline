import { v4 } from 'uuid';
import psql from '../utils/sql';

interface Session {
    id: number;
    name: string;
    session_token: string;
    game_id: number;
    expires_at: string;
}

export const getSession = async (req, res) => {
    const sessionToken = req.params.token;

    const session = await querySession(sessionToken);

    if (session) {
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
};

export const createSession = async (req, res) => {
    const MILISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

    const { name, gameId } = req.body,
        sessionToken = v4(),
        expiresAt = new Date(Date.now() + MILISECONDS_IN_A_DAY);

    if (!name) {
        res.status(400).send({ message: "'name' is required" });
        return;
    }

    await psql().query(
        'INSERT INTO session (name, session_token, game_id, expires_at) values ($1, $2, $3, $4)',
        [name, sessionToken, gameId || null, expiresAt.toISOString()]
    );

    const session = await querySession(sessionToken);

    if (session) {
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
};

export const deleteSession = async (req, res) => {
    const { sessionToken } = req.body;

    await psql().query('DELETE FROM session WHERE session_token = $1', [
        sessionToken,
    ]);

    res.send();
};

async function querySession(token): Promise<Session> {
    const sessions = await psql().query(
        'SELECT * from session where session_token = $1 and expires_at > $2',
        [token, new Date().toISOString()]
    );

    return sessions?.rows?.[0];
}
