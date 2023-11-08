import Service from './service';

interface Session {
    id: number;
    session_token: string;
    game_uuid: string;
    expires_at: string;
}

class SessionService extends Service {
    baseUrl = '/session/';

    public async getSession(token: string) {
        return this.get<Session>(token);
    }

    public async createSession(gameId?: string) {
        const payload = {
            gameId,
        };
        return this.post<Session>('', payload, '');
    }

    public async updateSession(sessionToken: string, gameId: number) {
        const payload = {
            gameId,
        };
        return this.patch<Session>(sessionToken, payload, sessionToken);
    }

    public async deleteSession(token: string) {
        return this.delete(token, token);
    }
}

const service = new SessionService();
export default service;
