import { Game, GameStatus, PlayerState } from '@/components/game/types';
import config from '@/config/config'

export class GameService {
    static getGames(): Promise<{uuids: string[]}> {
        const request = new Request(config.api.url + '/game/uuids');

        return fetch(request, { credentials: 'include' })
            .then((response) => response.json())
            .catch((err) => console.error(err.message));
    }

    static getGame(uuid: string) {
        const request = new Request(config.api.url + '/game/' + uuid);

        return fetch(request, { credentials: 'include' })
            .then((response) => response.json())
            .catch((err) => console.error(err.message));
    }

    static createGame(hostName: string) {
        const request = new Request(config.api.url + '/game');

        const payload = {
            name: hostName,
            type: 'standard',
        };

        return fetch(request, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
        })
            .then((response) => response.json())
            .catch((err) => console.error(err.message));
    }

    static updateGame(uuid: string, status: GameStatus, playerState?: PlayerState) {
        const request = new Request(config.api.url + '/game/' + uuid);
        
        const payload = {uuid, game_status: status, player_state: playerState};
        return fetch(request, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
        })
            .then((response) => response.json())
            .catch((err) => console.error(err.message));
    }

    static joinGame(uuid: string, playerName: string) {
        const request = new Request(`${config.api.url}/game/${uuid}/join`);

        const payload = {
            name: playerName,
        };

        return fetch(request, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include',
        })
            .then((response) => response.json())
    }
}
