import Service from './service';

class WordService extends Service {
    baseUrl = '/words/'

    public async getGoalWord() {
        return this.get<string>('goal-word')
    }

    public async getValidGuesses() {
        return this.get<string[]>('valid-guesses');
    }
}

const service = new WordService()
export default service