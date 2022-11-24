const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');

module.exports.getWords = async (req, res) => {
    let words = [];

    const filePath = path.join(__dirname, '..', '/word-data/valid_guesses.csv');
    
    const stream = fs.createReadStream(filePath)  
        .pipe(parse({ delimiter: ",", from_line: 2 }));
    
    stream.on("data", function (row) {
            words.push(row[0]);
        });
    
    // sleep to read file, please make this less jank
    await new Promise(r => setTimeout(r, 1000));

    res.send(words);
}