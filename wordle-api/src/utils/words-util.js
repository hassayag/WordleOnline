class WordsUtil {
    static async randomWord() {
        const words = await _readFile('word-data/valid_solutions.csv');
    
        const randIndex = Math.floor(Math.random() * words.length);
    
        return words[randIndex];
    }
}

module.exports = WordsUtil;