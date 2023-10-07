import config from '@/config/config';
export class SessionService {
    static getSession(token) {
        const request = new Request(config.api.url + '/session/' + token);
        return fetch(request, { credentials: 'include' }).then((response) => response.json());
    }
    static createSession(name, gameId) {
        const request = new Request(config.api.url + '/session');
        const payload = {
            name,
            gameId
        };
        return fetch(request, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
        }).then((response) => response.json());
    }
    // static updateSession() {
    // }
    static deleteSession(token) {
        const request = new Request(config.api.url + '/session/' + token);
        return fetch(request, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        }).then((response) => response.json());
    }
}
//# sourceMappingURL=session-service.js.map