import Config from '../config.js';

export class WordService {
    static getGoalWord() {
        const request = new Request(Config.api.url + '/words/goal-word');

        return fetch(request).then((response) => response.json());
    }

    static getValidGuesses() {
        const request = new Request(Config.api.url + '/words/valid-guesses');

        return fetch(request).then((response) => response.json());
    }
}
