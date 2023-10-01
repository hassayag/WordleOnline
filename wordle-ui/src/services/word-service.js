import config from 'config/config'

export class WordService {
    static getGoalWord() {
        const request = new Request(config.api.url + '/words/goal-word');

        return fetch(request)
            .then((response) => response.json())
            .catch((err) => console.error(err.message));
    }

    static getValidGuesses() {
        const request = new Request(config.api.url + '/words/valid-guesses');

        return fetch(request)
            .then((response) => response.json())
            .catch((err) => console.error(err.message));
    }
}
