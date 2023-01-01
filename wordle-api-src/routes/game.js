const express = require('express');
const router = express.Router();
const controller = require('../controllers/game');

const bodyParser = require('body-parser'),
    jsonParser = bodyParser.json()

router.get('/uuids', controller.getUuids);
router.get('/:uuid', controller.getGame);
router.post('/', jsonParser, controller.create);
router.patch('/:uuid', jsonParser, controller.update);

module.exports = router;