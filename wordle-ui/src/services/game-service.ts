import { Game, GameStatus, PlayerState } from '@/components/game/types';
import Service from './service';

class GameService extends Service {
    protected baseUrl = '/game/';

    public async getGames(sessionToken?: string) {
        return this.get<{ uuids: string[] }>('uuids', true, sessionToken);
    }

    public async getGame(uuid: string) {
        return this.get<Game>(uuid);
    }

    public async createGame(hostName: string) {
        const payload = {
            name: hostName,
            type: 'standard',
        };

        return this.post<Game>('', payload);
    }

    public async updateGame(
        uuid: string,
        status: GameStatus,
        playerState?: PlayerState
    ) {
        const payload = {
            uuid,
            game_status: status,
            player_state: playerState,
        };
        return this.patch<Game>(uuid, payload);
    }

    public async joinGame(uuid: string, playerName: string) {
        const payload = {
            name: playerName,
        };
        return this.post<Game>(`${uuid}/join`, payload);
    }
}

const service = new GameService();
export default service;
