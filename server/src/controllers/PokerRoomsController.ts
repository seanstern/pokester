import { RequestHandler } from "express";
import { Table } from "@chevtek/poker-engine";
import { Table as CommonAPITable, PlayerAction, Player } from "common-api";
import PokerRoom from "../models/PokerRoom";
import viewOfTable from "../views/player-views-of/ViewOfTable";

export type CreateReqBody = {
  name: string;
  buyIn?: number;
  smallBlind?: number;
  bigBlind?: number;
};
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
      table: new Table(),
    });
    await pr.save();

    res.status(201).json(pr.id);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export type GetReqParams = {
  id: string;
};
export type GetResBody = {
  id: string;
  name: string;
  table: CommonAPITable;
};
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
      params: { id },
    } = req;

    const pr = await PokerRoom.findOne({
      _id: id,
      playerIds: sessionID,
    }).exec();
    if (!pr) {
      throw new Error("PokerRoom does not exist");
    }

    const { name, table } = pr;
    res.status(200).json({
      id,
      name,
      table: viewOfTable(sessionID, table),
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export type ActReqParams = {
  id: string;
};
type BetActReqBody = {
  action: PlayerAction.BET;
  amount: number;
};
type CallActReqBody = {
  action: PlayerAction.CALL;
};
type RaiseActReqBody = {
  action: PlayerAction.RAISE;
  amount: number;
};
type CheckActReqBody = {
  action: PlayerAction.CHECK;
};
type FoldActReqBody = {
  action: PlayerAction.FOLD;
};
export type ActReqBody =
  | BetActReqBody
  | CallActReqBody
  | RaiseActReqBody
  | CheckActReqBody
  | FoldActReqBody;
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
      params: { id: roomId },
      body,
    } = req;

    const pr = await PokerRoom.findOne({
      _id: roomId,
      playerIds: sessionID,
    }).exec();
    if (!pr) {
      throw new Error("PokerRoom does not exist");
    }

    const currentActor = pr.table.currentActor;
    if (currentActor?.id !== sessionID) {
      throw new Error("No action can be taken at this time");
    }

    switch (body.action) {
      case PlayerAction.BET:
        currentActor.betAction(body.amount);
        break;
      case PlayerAction.CALL:
        currentActor.callAction();
        break;
      case PlayerAction.RAISE:
        currentActor.raiseAction(body.amount);
        break;
      case PlayerAction.CHECK:
        currentActor.checkAction();
        break;
      case PlayerAction.FOLD:
        currentActor.foldAction();
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
