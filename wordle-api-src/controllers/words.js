const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');

module.exports.getValidGuesses = async (req, res) => {
    const guesses = await _readFile('/word-data/valid_guesses.csv');
    const solutions = await _readFile('/word-data/valid_solutions.csv');

    res.send({ words: [...guesses, ...solutions] });
}

module.exports.getGoalWord = async (req, res) => {
    const words = await _readFile('/word-data/valid_solutions.csv');

    const randIndex = Math.floor(Math.random() * words.length),
        randWord = words[randIndex];

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