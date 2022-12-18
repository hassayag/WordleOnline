import Config from './config.json';

export class GameService {
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