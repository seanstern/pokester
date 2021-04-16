import { RequestHandler } from 'express';
import GameModel, {
	IGameCreator,
	IGameDoc,
	SquareValue,
} from '../models/GameModel';
import TSelectedDocument from '../models/TSelectedDocument';

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

const create: RequestHandler = async (req, res, next) => {
	try {
		const { sessionID } = req;

		const game: IGameCreator = {
			board: BLANK_BOARD,
			players: [sessionID] as [string],
			nextTurn: 0,
		};

		const { id } = await GameModel.create<IGameCreator>(game);

		return res.status(201).json(id);
	} catch (err) {
		return next(err);
	}
};

const getAll: RequestHandler = async (req, res, next) => {
	try {
		const games = (await GameModel.find({ players: { $size: 1 } })
			.select('_id')
			.exec()) as TSelectedDocument<IGameDoc, never>[];

		return res.status(200).json(games.map(({ id }) => id));
	} catch (err) {
		return next(err);
	}
};

const get: RequestHandler = async (req, res, next) => {
	try {
		const {
			params: { gameID },
			sessionID,
		} = req;

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

		const isMyTurn = game.players[game.nextTurn] === sessionID;

		const { board } = game.toJSON();

		const mySymbol =
			game.players.indexOf(sessionID) === 0
				? SquareValue.X
				: SquareValue.O;

		return res.status(200).send({ board, hasStarted, isMyTurn, mySymbol });
	} catch (err) {
		return next(err);
	}
};

const takeTurn: RequestHandler<
	{ gameID: string },
	void,
	{ squareIdx: number }
> = async (req, res, next) => {
	try {
		const {
			body: { squareIdx },
			params: { gameID },
			sessionID,
		} = req;

		const game = await GameModel.findOne({
			_id: gameID,
			players: sessionID,
		}).exec();
		if (game === null) {
			throw new Error('game does not exist');
		}

		const hasStarted = game.players.length === 2;
		if (!hasStarted) {
			throw new Error('game has not started');
		}

		const isMyTurn = game.players[game.nextTurn] === sessionID;
		if (!isMyTurn) {
			throw new Error('not your turn');
		}

		const isFreeSpace = game.board[squareIdx] === SquareValue.BLANK;
		if (!isFreeSpace) {
			throw new Error('cannot move in occupied space');
		}

		const moveValue = game.nextTurn === 0 ? SquareValue.X : SquareValue.O;

		game.board.set(squareIdx, moveValue);
		game.nextTurn = game.nextTurn === 0 ? 1 : 0;

		await game.save();

		return res.status(204).end();
	} catch (err) {
		return next(err);
	}
};

export default {
	create,
	get,
	getAll,
	takeTurn,
};
