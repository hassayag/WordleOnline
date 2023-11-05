import { findStateIndex } from '../api/game/utils';
import db from '../api/game/db-utils';
import { BadRequestError, NotFoundError } from '../error';
import { Game, Letter, UpdateGameReq } from '../api/game/types';
import { findAllInds } from '../utils/array-utils';

export class GameService {
    static async getGame(uuid: string, sessionToken: string) {
        const game: Game = await db.get(uuid);

        const playerStateIndex = findStateIndex(game, sessionToken);
        if (playerStateIndex === -1) {
            console.info(`[game] User does not have access to game uuid ${uuid}`)
            throw new NotFoundError(`Game uuid ${uuid} not found`);
        }

        return game;
    }

    static async updateGame(
        updateOptions: UpdateGameReq['body'],
        sessionToken: string
    ) {
        const {
            uuid,
            player_state: playerState,
            game_status: gameStatus,
        } = updateOptions;

        // assign the user's game state to the correct part of state object
        const game = await db.get(uuid);

        const playerStateIndex = findStateIndex(game, sessionToken);
        if (playerStateIndex === -1 && game.game_status !== 'lobby') {
            console.info(`[game] User does not have access to game uuid ${uuid}`)
            throw new BadRequestError(`Game uuid ${uuid} not found`);
        }
        if (playerState) {
            game.state[playerStateIndex] = playerState;
        }
        if (gameStatus) {
            game.game_status = gameStatus;
        }

        const newGame = await db.update(game);
        return newGame;
    }

    static async postGuess(
        uuid: string,
        guess: { row: number; word: Letter[] },
        sessionToken: string
    ) {
        const game = await this.getGame(uuid, sessionToken);

        const playerStateIndex = findStateIndex(game, sessionToken);
        if (playerStateIndex === -1 && game.game_status !== 'lobby') {
            console.info(`[game] User does not have access to game uuid ${uuid}`)
            throw new BadRequestError(`Game uuid ${uuid} not found`);
        }
        
        const playerState = game.state[playerStateIndex];

        const { goalWord, letterStates, board } = playerState;
        const newLetterStates = Object.assign({}, letterStates),
            newWordRows = Object.assign({}, board),
            row = [],
            currentRowChars = guess.word,
            goalWordChars = playerState.goalWord.split('');

        for (let i = 0; i < currentRowChars.length; i++) {
            const char = currentRowChars[i];

            // find index of user's input character in the goal word
            const matchedInds = findAllInds(goalWordChars, char.key);

            // index == current index, perfect match
            if (matchedInds.includes(i)) {
                char.state = 'green';
                newLetterStates[char.key] = 'green';
            }
            // match not found, grey out key
            else if (matchedInds.length === 0) {
                char.state = 'grey';
                if (newLetterStates[char.key] === 'white') {
                    // can't downgrade key state from green/yellow
                    newLetterStates[char.key] = 'grey';
                }
            }
            // if neither, it must be a partial match, so set as yellow
            else {
                char.state = 'yellow';
                if (newLetterStates[char.key] !== 'green') {
                    // can't downgrade key state green
                    newLetterStates[char.key] = 'yellow';
                }
            }
            row.push(char);
        }

        newWordRows[guess.row] = row;

        let gameIsWon=null
        // check for win
        if (
            currentRowChars.length &&
            currentRowChars
                .map((char) => char.key)
                .every((char, ind) => char === goalWordChars[ind])
        ) {
            gameIsWon = true;
        }
        // check for loss
        else if (guess.row === 5) {
            gameIsWon = false;
        }

        if (gameIsWon !== null) {
            game.game_status = 'done';
        }

        // send request to update db
        await GameService.updateGame(
            {
                uuid: game.uuid,
                player_state: {
                    goalWord: goalWord,
                    board: newWordRows,
                    letterStates: newLetterStates,
                    player: playerState.player,
                    isWon: gameIsWon
                },
                game_status: game.game_status,
            },
            sessionToken
        );
    }
}
