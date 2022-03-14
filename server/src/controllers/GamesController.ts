import { RequestHandler } from "express";
import GameEngine from "../engines/GameEngine";
import GameModel, {
  IGameCreator,
  IGameDoc,
  ESquareValue,
  TBoard,
} from "../models/GameModel";
import TSelectedDocument from "../models/TSelectedDocument";

const BLANK_BOARD = [
  ESquareValue.BLANK,
  ESquareValue.BLANK,
  ESquareValue.BLANK,
  ESquareValue.BLANK,
  ESquareValue.BLANK,
  ESquareValue.BLANK,
  ESquareValue.BLANK,
  ESquareValue.BLANK,
  ESquareValue.BLANK,
] as IGameCreator["board"];

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

const getAll: RequestHandler<
  void,
  string[],
  void,
  { filter?: string }
> = async (req, res, next) => {
  try {
    const {
      query: { filter },
      sessionID,
    } = req;
    let conditions = {};
    switch (filter) {
      case "join":
        conditions = { players: { $size: 1, $ne: sessionID } };
        break;
      case "current":
        conditions = { players: { $eq: sessionID }, isOver: false };
        break;
      case "past":
        conditions = { players: { $size: 2, $eq: sessionID }, isOver: true };
        break;
      default:
        throw new Error("no filter criteria");
    }

    const games = (await GameModel.find(conditions)
      .select("_id")
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
      throw new Error("game does not exist");
    }

    const playerHasJoined = game.players.includes(sessionID);
    if (!playerHasJoined && game.players.length === 2) {
      throw new Error("game does not exist");
    }

    if (!playerHasJoined) {
      game.players.push(sessionID);
      game = await game.save();
    }

    const hasStarted = game.players.length === 2;

    const isMyTurn = game.players[game.nextTurn] === sessionID;

    const { board, isOver } = game.toJSON();

    const mySymbol =
      game.players.indexOf(sessionID) === 0 ? ESquareValue.X : ESquareValue.O;

    return res
      .status(200)
      .send({ board, hasStarted, isMyTurn, mySymbol, isOver });
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
      isOver: false,
    }).exec();
    if (game === null) {
      throw new Error("game does not exist");
    }

    const hasStarted = game.players.length === 2;
    if (!hasStarted) {
      throw new Error("game has not started");
    }

    const isMyTurn = game.players[game.nextTurn] === sessionID;
    if (!isMyTurn) {
      throw new Error("not your turn");
    }

    const isFreeSpace = game.board[squareIdx] === ESquareValue.BLANK;
    if (!isFreeSpace) {
      throw new Error("cannot move in occupied space");
    }

    const moveValue = game.nextTurn === 0 ? ESquareValue.X : ESquareValue.O;

    game.board.set(squareIdx, moveValue);
    game.nextTurn = game.nextTurn === 0 ? 1 : 0;

    const { status } = GameEngine.getFinalResult(
      game.board.toObject() as TBoard
    );
    game.isOver = status === "WINNER" || status === "STALEMATE";

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
