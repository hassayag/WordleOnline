import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

let words;

export const randomWord = async () => {
    if (!words) {
        words = await readFile('./data/word-data/valid_solutions.csv');
    }

    const randIndex = Math.floor(Math.random() * words.length);

    return words[randIndex];
};

export const readFile = async (fileDir) => {
    const words = [];
    const filePath = path.resolve(fileDir);

    const stream = fs
        .createReadStream(filePath)
        .pipe(parse({ delimiter: ',', from_line: 2 }));

    stream.on('data', function (row) {
        words.push(row[0]);
    });

    // sleep to read file, please make this less jank
    await new Promise((r) => setTimeout(r, 1000));

    return words;
};
