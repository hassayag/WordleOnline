import cors from 'cors';
import express from 'express';

import { getValidGuesses, getGoalWord } from '../controllers/words.js';

const router = express.Router();

router.get('/valid-guesses', cors({ maxAge: 86400 }), getValidGuesses);
router.get('/goal-word', getGoalWord);

export default router;
