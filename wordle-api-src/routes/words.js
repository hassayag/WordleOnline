const express = require('express');
const router = express.Router();
const controller = require('../controllers/words');

router.get('/', controller.getWords);

module.exports = router;