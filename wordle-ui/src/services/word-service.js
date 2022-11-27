
export class WordService {
    
    constructor() {
        this._url = 'http://localhost:8081'
    }

    getGoalWord() {
        const request = new Request(this._url + '/words/goal-word')

        return fetch(request)
            .then(response => response.json());
    }

    getValidGuesses() {
        const request = new Request(this._url + '/words/valid-guesses')

        return fetch(request)
            .then(response => response.json());
    }
}