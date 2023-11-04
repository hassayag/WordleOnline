import { v4 } from 'uuid';
import psql from '../../db/db';

interface Session {
    id: number;
    session_token: string;
    game_uuid: string;
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

    const { gameId } = req.body,
        sessionToken = v4(),
        expiresAt = new Date(Date.now() + MILISECONDS_IN_A_DAY);

    await psql().query(
        'INSERT INTO session (session_token, game_uuid, expires_at) values ($1, $2, $3, $4)',
        [ sessionToken, gameId || null, expiresAt.toISOString()]
    );

    const session = await querySession(sessionToken);

    if (session) {
        res.send(session);
    } else {
        res.status(404).send('Session not found');
    }
};

export const updateSession = async (req, res) => {
    const sessionToken = req.params.token
    const session = await querySession(sessionToken);
    if (!session) {
        res.status(404).send('Session not found');
        return
    }

    const MILISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

    const { gameId } = req.body,
        expiresAt = new Date(Date.now() + MILISECONDS_IN_A_DAY);

    await psql().query(
        'UPDATE session SET game_uuid = $1, expires_at = $2 WHERE session_token = $3 ',
        [gameId, expiresAt.toISOString(), sessionToken]
    );

    const newSession = await querySession(sessionToken);

    if (newSession) {
        res.send(newSession);
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
