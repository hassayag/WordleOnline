import Service from './service';

class WordService extends Service {
    protected baseUrl = '/words/'

    public async getGoalWord() {
        return this.get<string>('goal-word', false)
    }

    public async getValidGuesses() {
        return this.get<string[]>('valid-guesses', false);
    }
}

const service = new WordService()
export default service
