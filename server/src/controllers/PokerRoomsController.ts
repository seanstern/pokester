import { RequestHandler } from "express";
import { Table, Player } from "@chevtek/poker-engine";
import { Routes } from "@pokester/common-api";
import PokerRoom from "../models/PokerRoom";
import viewOfTable from "../views/player-views-of/ViewOfTable";
import { canDealCards } from "../poker-engine/Utils";

export type CreateReqBody = Routes.PokerRooms.Create.ReqBody;
/**
 * Given an HTTP request to create a new PokerRoom, an HTTP response, and a
 * callback, attempts to create a new PokerRoom. Responds with a status of
 * 201 and a json string representing the id of the PokerRoom when successful;
 * calls the callback with error information upon failure.
 * @param req  an HTTP request
 * @param req.sessionID the id of the requester's session
 * @param req.body the body of the HTTP request
 * @param req.body.name the name of the PokerRoom
 * @param req.body.buyIn the (optional) minimum buy in for the table
 * @param req.body.smallBlind the (optional) small blind for the table
 * @param req.body.smallBlind the (optional) big blind for the table
 * @param res the HTTP response
 * @param next the callback
 */
export const create: RequestHandler<
  never,
  string,
  CreateReqBody,
  never,
  never
> = async (req, res, next) => {
  try {
    const {
      sessionID,
      body: { name, buyIn, smallBlind, bigBlind },
    } = req;

    const table = new Table(buyIn, smallBlind, bigBlind);
    table.sitDown(sessionID, table.buyIn);

    const pr = new PokerRoom({
      name,
      creatorId: sessionID,
      table,
    });
    await pr.save();

    res.status(201).json(pr.id);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export type GetAllResBody = Routes.PokerRooms.GetAll.ResBody;
export type GetAllReqQuery = Routes.PokerRooms.GetAll.ReqQuery;
/**
 * Given an HTTP request to get PokerRooms (including optional filters),
 * an HTTP response, and a callback, attempts to respond with a JSON
 * representation of the PokerRooms. Responds with a status of 200 and
 * JSON representation of the PokerRooms when successful; calls the callback
 * with error information upon failure.
 *
 * @param req  an HTTP request
 * @param req.sessionID the id of the requester's session
 * @param req.query the query string parameters, representing the filters
 * @param req.query.creatorId optionally filters for PokerRooms with this
 *   creatorId
 * @param req.query.name optionally filters for PokerRooms with this name
 * @param req.query.openSeat optionally filters for PokerRooms with an open
 *   seat (i.e. a new Player can sit) when true; without an open seat (i.e
 *   a new Player cannot sit) when false
 * @param res the HTTP response
 * @param next the callback
 */
export const getAll: RequestHandler<
  never,
  GetAllResBody,
  never,
  GetAllReqQuery,
  never
> = async (req, res, next) => {
  try {
    const {
      query: { creatorId, name, openSeat },
    } = req;

    const creatorIdFilter = creatorId ? { creatorId } : {};
    const nameFilter = name ? { name } : {};
    const openSeatFilter =
      openSeat !== undefined
        ? { playersCount: openSeat ? { $lt: 10 } : { $gte: 10 } }
        : {};

    const pokerRooms = await PokerRoom.find({
      ...creatorIdFilter,
      ...nameFilter,
      ...openSeatFilter,
    }).exec();

    const pokerRoomsResponse: GetAllResBody = pokerRooms.map(
      ({ id, name, playersCount }) => ({
        id,
        name,
        playersCount,
      })
    );

    res.status(200).json(pokerRoomsResponse);
    return;
  } catch (err) {
    return next(err);
  }
};

export type GetReqParams = {
  roomId: string;
};
export type GetResBody = Routes.PokerRooms.Get.ResBody;
/**
 * Given an HTTP request to get a PokerRoom, an HTTP response, and a
 * callback, attempts to respond with a JSON representation of the
 * PokerRoom. Responds with a status of 200 and JSON representation of
 * the PokerRoom when successful; calls the callback with error information
 * upon failure.
 * @param req  an HTTP request
 * @param req.sessionID the id of the requester's session
 * @param req.params the route parametes
 * @param req.params.id the id of the requested PokerRoom
 * @param res the HTTP response
 * @param next the callback
 */
export const get: RequestHandler<
  GetReqParams,
  GetResBody,
  never,
  never,
  never
> = async (req, res, next) => {
  try {
    const {
      sessionID,
      params: { roomId },
    } = req;

    const pr = await PokerRoom.findOne({
      _id: roomId,
      playerIds: sessionID,
    }).exec();
    if (!pr) {
      throw new Error("PokerRoom does not exist");
    }

    const { name, table } = pr;
    res.status(200).json({
      id: roomId,
      name,
      table: viewOfTable(sessionID, table),
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

/**
 * Given an id and an array of nullable players, returns the player from
 * the array with the corresponding id. Throws if no element in the array
 * has the corresponding id.
 * @param id id of player to find
 * @param players array of nullable players
 * @returns the player from the array with the corresponding id
 */
const findPlayer = (id: string, players: Table["players"]): Player => {
  const player = players.find((player) => player?.id === id);
  if (!player) {
    throw new Error(`No player with id ${id}`);
  }
  return player as Player;
};

export type ActReqParams = {
  roomId: string;
};
export type ActReqBody = Routes.PokerRooms.Act.ReqBody;
/**
 * Given an HTTP request to take a PlayerAction in PokerRoom, an HTTP response,
 * and a callback, attempts to take the action specified in the request.
 * Responds with a status of 204 when successful; calls the callback with error
 * information upon failure.
 * @param req  an HTTP request
 * @param req.sessionID the id of the requester's session
 * @param req.params the route parametes
 * @param req.params.id the id of the requested PokerRoom
 * @param req.body the action to be taken
 * @param res the HTTP response
 * @param next the callback
 */
export const act: RequestHandler<
  ActReqParams,
  never,
  ActReqBody,
  never,
  never
> = async (req, res, next) => {
  try {
    const {
      sessionID,
      params: { roomId },
      body,
    } = req;

    const pr = await PokerRoom.findOne({
      _id: roomId,
    }).exec();
    if (!pr) {
      throw new Error("PokerRoom does not exist");
    }

    const { table } = pr;
    switch (body.action) {
      case Routes.PokerRooms.Act.PlayerAction.SIT:
        pr.table.sitDown(sessionID, table.buyIn);
        break;
      case Routes.PokerRooms.Act.PlayerAction.STAND:
        pr.table.standUp(sessionID);
        break;
      case Routes.PokerRooms.Act.PlayerAction.DEAL:
        if (canDealCards(findPlayer(sessionID, table.players))) {
          pr.table.dealCards();
        }
        break;
      case Routes.PokerRooms.Act.PlayerAction.BET:
        findPlayer(sessionID, table.players).betAction(body.amount);
        break;
      case Routes.PokerRooms.Act.PlayerAction.CALL:
        findPlayer(sessionID, table.players).callAction();
        break;
      case Routes.PokerRooms.Act.PlayerAction.RAISE:
        findPlayer(sessionID, table.players).raiseAction(body.amount);
        break;
      case Routes.PokerRooms.Act.PlayerAction.CHECK:
        findPlayer(sessionID, table.players).checkAction();
        break;
      case Routes.PokerRooms.Act.PlayerAction.FOLD:
        findPlayer(sessionID, table.players).foldAction();
        break;
      default:
        throw new Error(`action "${(body as any).action}" is invalid`);
    }

    await pr.save();

    res.status(204).end();
    return;
  } catch (err) {
    next(err);
  }
};
