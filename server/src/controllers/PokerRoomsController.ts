import { Player, Table } from "@chevtek/poker-engine";
import { Act, Create, Get, GetAll } from "@pokester/common-api/poker-rooms";
import actReqBodySchema from "@pokester/common-api/poker-rooms/act/reqBodySchema";
import createReqBodySchema from "@pokester/common-api/poker-rooms/create/reqBodySchema";
import { RequestHandler } from "express";
import PokerRoom from "../models/PokerRoom";
import { canDealCards } from "../poker-engine/Utils";
import viewOfTable from "../views/player-views-of/ViewOfTable";

export type CreateReqBody = Create.ReqBody;
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
    const { sessionID, body: unvalidatedBody } = req;

    const { name, buyIn, smallBlind, bigBlind } =
      createReqBodySchema.validateSync(unvalidatedBody);

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

export type GetAllResBody = GetAll.ResBody;
export type GetAllReqQuery = GetAll.ReqQuery;
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
      query: { creatorId, name, canSit, isSeated },
      sessionID,
    } = req;

    const mutablePokerRoomsQuery = PokerRoom.find();
    if (name) {
      mutablePokerRoomsQuery.where({ name });
    }
    if (creatorId) {
      mutablePokerRoomsQuery.where({ creatorId });
    }
    if (canSit && ["false", "true"].includes(canSit)) {
      mutablePokerRoomsQuery.byCanPlayerSit(sessionID, canSit === "true");
    }
    if (isSeated && ["false", "true"].includes(isSeated)) {
      mutablePokerRoomsQuery.byIsPlayerSeated(sessionID, isSeated === "true");
    }
    mutablePokerRoomsQuery.select({
      name: 1,
      playerIds: 1,
      creatorId: 1,
    });

    const pokerRooms = await mutablePokerRoomsQuery.exec();

    const pokerRoomsResponse: GetAllResBody = pokerRooms.map((pr) => {
      const { id, name, creatorId } = pr;
      if (!name) {
        throw new Error(`PokerRoom ${id} missing name property`);
      }
      if (!creatorId) {
        throw new Error(`PokerRoom ${id} missing creatorId property`);
      }
      return {
        id,
        name,
        creatorId,
        canSit: pr.canSit(sessionID),
        isSeated: pr.isSeated(sessionID),
      };
    });

    res.status(200).json(pokerRoomsResponse);
    return;
  } catch (err) {
    return next(err);
  }
};

export type GetReqParams = {
  roomId: string;
};
export type GetResBody = Get.ResBody;
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
    }).exec();
    if (!pr?.name || !pr?.table) {
      throw new Error("PokerRoom does not exist");
    }

    const { name, table } = pr;
    res.status(200).json({
      id: roomId,
      name,
      table: viewOfTable(sessionID, table),
      canSit: pr.canSit(sessionID),
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
export type ActReqBody = Act.ReqBody;
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
      body: unvalidatedBody,
    } = req;

    const body = actReqBodySchema.validateSync(unvalidatedBody);

    const pr = await PokerRoom.findOne({
      _id: roomId,
    }).exec();
    if (!pr?.table) {
      throw new Error("PokerRoom does not exist");
    }

    const { table } = pr;
    switch (body.action) {
      case Act.PlayerAction.SIT:
        pr.table.sitDown(sessionID, table.buyIn, body.seatNumber);
        break;
      case Act.PlayerAction.STAND:
        pr.table.standUp(sessionID);
        break;
      case Act.PlayerAction.DEAL:
        if (!canDealCards(findPlayer(sessionID, table.players))) {
          throw new Error("Action invoked on player out of turn!");
        }
        pr.table.dealCards();
        break;
      case Act.PlayerAction.BET:
        findPlayer(sessionID, table.players).betAction(body.amount);
        break;
      case Act.PlayerAction.CALL:
        findPlayer(sessionID, table.players).callAction();
        break;
      case Act.PlayerAction.RAISE:
        findPlayer(sessionID, table.players).raiseAction(body.amount);
        break;
      case Act.PlayerAction.CHECK:
        findPlayer(sessionID, table.players).checkAction();
        break;
      case Act.PlayerAction.FOLD:
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
