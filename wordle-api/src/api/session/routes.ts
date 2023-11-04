import express from 'express';
import { getSession, createSession, deleteSession, updateSession } from './controller';
import bodyParser from 'body-parser';

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/:token', getSession);
router.post('/', jsonParser, createSession);
router.patch('/:token', jsonParser, updateSession);
router.delete('/:token', jsonParser, deleteSession);

export default router;
