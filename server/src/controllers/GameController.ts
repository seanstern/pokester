import { RequestHandler } from 'express';
import GameModel, { IGameCreator, IGameDoc, SquareValue } from '../models/GameModel';
import ISelectedDocument from '../models/ISelectedDocument';


const BLANK_BOARD = [
    SquareValue.BLANK,
    SquareValue.BLANK,
    SquareValue.BLANK,
    SquareValue.BLANK,
    SquareValue.BLANK,
    SquareValue.BLANK,
    SquareValue.BLANK,
    SquareValue.BLANK,
    SquareValue.BLANK,
] as IGameCreator['board'];

export const create: RequestHandler = async (req, res, next) => {
    try {
        const { sessionID } = req;

        const game: IGameCreator = {
            board: BLANK_BOARD,
            players: [sessionID] as [string],
            nextMove: 0,
        };

        const { id } = await GameModel.create<IGameCreator>(game);
        
        return res.status(201).json(id);
    } catch (err) {
        return next(err);
    }
};

export const getAll: RequestHandler = async (req, res, next) => {
    try {
        const games = await GameModel
            .find({ players: { $size: 1} })
            .select('_id')
            .exec() as ISelectedDocument<IGameDoc, never>[];
            
        return res.status(200).json(games.map(({ id }) => id));
    } catch (err) {
        return next(err);
    }
}

export const get: RequestHandler = async (req, res, next) => {
    try {
        const { params: { gameID }, sessionID } = req;

        let game = await GameModel.findById(gameID).exec();

        if (game === null) {
            throw new Error('game does not exist');
        }

        const playerHasJoined = game.players.includes(sessionID);
        if (!playerHasJoined && game.players.length === 2) {
            throw new Error('game does not exist');
        }

        if (!playerHasJoined) {
            game.players.push(sessionID);
            game = await game.save();
        }

        const hasStarted = game.players.length === 2;
        
        const isMyTurn = game.players[game.nextMove] === sessionID;

        const { board } = game.toJSON();

        return res.status(200).send({ board, hasStarted, isMyTurn });
    } catch (err) {
        return next(err);
    }   
}

export const move: RequestHandler<{ gameID: string }, any, { idx: number }> = async (req, res, next) => {
    try {
        const { body: { idx }, params: { gameID }, sessionID } = req;

        const game = await GameModel.findOne({ _id: gameID, players: sessionID }).exec();
        if (game === null) {
            throw new Error('game does not exist');
        }

        const hasStarted = game.players.length === 2;
        if (!hasStarted) {
            throw new Error('game has not started');
        }

        const isMyTurn = game.players[game.nextMove] === sessionID;
        if (!isMyTurn) {
            throw new Error('not your turn');
        }

        const isFreeSpace = game.board[idx] === SquareValue.BLANK;
        if (!isFreeSpace) {
            throw new Error('cannot move in occupied space');
        }

        const moveValue = game.nextMove === 0 ? SquareValue.X : SquareValue.O;
        const nextMove = game.nextMove === 0 ? 1 : 0;

        game.board.set(idx, moveValue);
        game.nextMove = game.nextMove === 0 ? 1 : 0;

        await game.save();

        return res.status(204).end();
    } catch (err) {
        return next(err);
    }
}
