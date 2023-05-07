import Config from '../config.json';

export class SessionService {
    static getSession(token) {
        const request = new Request(Config.api.url + '/session/' + token);

        return fetch(request).then((response) => response.json());
    }

    static createSession(name, gameId) {
        const request = new Request(Config.api.url + '/session');

        const payload = {
            name,
            gameId,
        };

        return fetch(request, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).then((response) => response.json());
    }

    // static updateSession() {

    // }

    static deleteSession(token) {
        const request = new Request(Config.api.url + '/session/' + token);

        return fetch(request, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }).then((response) => response.json());
    }
}
