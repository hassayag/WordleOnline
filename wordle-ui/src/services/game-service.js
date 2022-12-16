import Config from './config.json';

export class GameService {
    static createGame(hostName) {
        const request = new Request(Config.api.url + '/game')

        const payload = {
            player_a: hostName,
            game_type: 'standard'
        }

        return fetch(request, { body: JSON.stringify(payload) })
            .then(response => response.json());
    }
}