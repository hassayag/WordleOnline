import { randomWord, readFile } from '../utils/words-util.js';

const guesses = await readFile('./db/word-data/valid_guesses.csv');
const solutions = await readFile('./db/word-data/valid_solutions.csv');

export const getValidGuesses = async (req, res) => {
    res.send({ words: [...guesses, ...solutions] });
};

export const getGoalWord = async (req, res) => {
    const randWord = await randomWord();

    res.send({ word: randWord });
};
