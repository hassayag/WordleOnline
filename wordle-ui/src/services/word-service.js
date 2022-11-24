
export class WordService {
    
    constructor() {
        this._url = 'http://localhost:8080'
    }

    getWords() {
        let words;

        const request = new Request(this._url + '/words')

        fetch(request)
            .then(response => response.json())
            .then(data => console.log('data', data))
            .catch(err => console.error('Error getting words', err));

        return words;
    }
}