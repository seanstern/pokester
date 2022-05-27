import { RequestHandler } from "express";
import { Table } from "@chevtek/poker-engine";
import { Table as CommonAPITable } from "common-api";
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
  }
};
