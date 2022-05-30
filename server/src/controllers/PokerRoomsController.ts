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
export const get: RequestHandler<
  GetReqParams,
  CommonAPITable,
  never,
  never,
  never
> = async (req, res, next) => {
  try {
    const {
      sessionID,
      params: { id: roomId },
    } = req;

    const pr = await PokerRoom.findOne({
      _id: roomId,
      playerIds: sessionID,
    }).exec();
    if (!pr) {
      throw new Error("PokerRoom does not exist");
    }

    res.status(200).json(viewOfTable(sessionID, pr.table));
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
