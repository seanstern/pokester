import { Router } from 'express';
import { create, get, getAll, move } from '../controllers/GameController';

const gamesRoutes = Router();
gamesRoutes.route('/')
    .get(getAll)
    .post(create);
gamesRoutes.route('/:gameID')
    .get(get)
    .patch(move);

export default gamesRoutes;