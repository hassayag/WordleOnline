const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const WordsUtil = require('../utils/words-util');

module.exports.getValidGuesses = async (req, res) => {
    const guesses = await _readFile('/word-data/valid_guesses.csv');
    const solutions = await _readFile('/word-data/valid_solutions.csv');

    res.send({ words: [...guesses, ...solutions] });
}

module.exports.getGoalWord = async (req, res) => {
    const randWord = await WordsUtil.randomWord();

    res.send({ word: randWord});
}

_readFile = async (fileDir) => {
    let words = [];

    const filePath = path.join(__dirname, '..', fileDir);
    
    const stream = fs.createReadStream(filePath)  
        .pipe(parse({ delimiter: ",", from_line: 2 }));
    
    stream.on("data", function (row) {
            words.push(row[0]);
        });
    
    // sleep to read file, please make this less jank
    await new Promise(r => setTimeout(r, 1000)); 

    return words;
}