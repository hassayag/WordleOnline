const express = require('express');
const router = express.Router();
const controller = require('../controllers/words');

router.get('/valid-guesses', controller.getValidGuesses);
router.get('/goal-word', controller.getGoalWord);

module.exports = router;