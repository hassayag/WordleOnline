import Service from './service';

interface Session {
    id: number,
    name: string,
    session_token: string
    game_id: number
    expires_at: string
}

class SessionService extends Service {
    baseUrl = '/session/';
    
    public async getSession(token: string) {
        return this.get<Session>(token, false)
    }

    public async createSession(name: string, gameId?: number) {
        const payload = {
            name,
            gameId
        };
        return this.post<Session>('', payload)
    }

    public async deleteSession(token: string) {
        return this.delete(token)
    }
}

const service = new SessionService()
export default service