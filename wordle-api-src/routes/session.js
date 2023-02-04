const express = require('express');
const router = express.Router();
const controller = require('../controllers/session');

const bodyParser = require('body-parser'),
    jsonParser = bodyParser.json()

router.get('/:token', controller.get);
router.post('/', jsonParser, controller.create);
router.delete('/:token', jsonParser, controller.delete);

module.exports = router;