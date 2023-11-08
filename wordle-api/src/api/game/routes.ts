import express from 'express';
import {
    getUuids,
    getGame,
    createGame,
    updateGame,
    joinGame,
    restartGame,
} from './controller';
const router = express.Router();

import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

router.get('/uuids', getUuids);
router.get('/:uuid', getGame);
router.post('/', jsonParser, createGame);
router.patch('/:uuid', jsonParser, updateGame);
router.post('/:uuid/join', jsonParser, joinGame);
router.post('/:uuid/restart', jsonParser, restartGame);

export default router;
