import Config from '../config.json';

export class GameService {
    static getGames() {
        const request = new Request(Config.api.url + '/game/uuids');

        return fetch(request).then((response) => response.json());
    }

    static getGame(uuid) {
        const request = new Request(Config.api.url + '/game/' + uuid);

        return fetch(request).then((response) => response.json());
    }

    static createGame(hostName) {
        const request = new Request(Config.api.url + '/game');

        const payload = {
            name: hostName,
            type: 'standard',
        };

        return fetch(request, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).then((response) => response.json());
    }

    static updateGame(uuid, state) {
        const request = new Request(Config.api.url + '/game/' + uuid);

        const payload = { uuid, state };

        return fetch(request, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).then((response) => response.json());
    }
}
