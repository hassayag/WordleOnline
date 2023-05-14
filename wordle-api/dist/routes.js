import express from 'express';
import { getUuids, getGame, createGame, updateGame, } from './controller';
const router = express.Router();
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();
router.get('/uuids', getUuids);
router.get('/:uuid', getGame);
router.post('/', jsonParser, createGame);
router.patch('/:uuid', jsonParser, updateGame);
export default router;
//# sourceMappingURL=routes.js.map