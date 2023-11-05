import { Game, GameStatus } from '@/components/game/types';
import Service from './service';
import { Player } from 'tone';

class GameService extends Service {
    protected baseUrl = '/game/';

    public async getGames(sessionToken?: string) {
        return this.get<{ uuids: string[] }>('uuids', sessionToken);
    }

    public async getGame(uuid: string, sessionToken: string) {
        return this.get<Game>(uuid, sessionToken);
    }

    public async createGame(hostName: string, sessionToken: string) {
        const payload = {
            name: hostName,
            type: 'standard',
        };

        return this.post<Game>('', payload, sessionToken);
    }

    public async updateGame(
        updateOptions: {uuid: string, status: GameStatus, playerState?: Player},
        sessionToken: string,
    ) {
        return this.patch<Game>(updateOptions.uuid, updateOptions, sessionToken);
    }

    public async joinGame(uuid: string, playerName: string, sessionToken: string) {
        const payload = {
            name: playerName,
        };
        return this.post<Game>(`${uuid}/join`, payload, sessionToken);
    }
}

const service = new GameService();
export default service;
