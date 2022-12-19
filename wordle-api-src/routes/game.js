const express = require('express');
const router = express.Router();
const controller = require('../controllers/game');

const bodyParser = require('body-parser'),
    jsonParser = bodyParser.json()

router.get('/', controller.get);
router.post('/', jsonParser, controller.create);

module.exports = router;