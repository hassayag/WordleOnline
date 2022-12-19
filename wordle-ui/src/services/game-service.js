import Config from './config.json';

export class GameService {
    static getGames() {
        const request = new Request(Config.api.url + '/game')

        return fetch(request).then(response => response.json());
    }

    static createGame(hostName) {
        const request = new Request(Config.api.url + '/game')

        const payload = {
            name: hostName,
            type: 'standard'
        }
        
        return fetch(request, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) 
        }).then(response => response.json());
    }
}