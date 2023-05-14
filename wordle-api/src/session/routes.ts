import express from 'express';
import { getSession, createSession, deleteSession } from './controller';
import bodyParser from 'body-parser';

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/:token', getSession);
router.post('/', jsonParser, createSession);
router.delete('/:token', jsonParser, deleteSession);

export default router;
