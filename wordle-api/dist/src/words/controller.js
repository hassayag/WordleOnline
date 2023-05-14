import { randomWord, readFile } from '../utils/words-util';
let guesses, solutions;
export const getValidGuesses = async (req, res) => {
    if (!guesses || !solutions) {
        guesses = await readFile('./db/word-data/valid_guesses.csv');
        solutions = await readFile('./db/word-data/valid_solutions.csv');
    }
    res.send({ words: [...guesses, ...solutions] });
};
export const getGoalWord = async (req, res) => {
    const randWord = await randomWord();
    res.send({ word: randWord });
};
//# sourceMappingURL=controller.js.map