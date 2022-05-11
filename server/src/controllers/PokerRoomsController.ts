import { RequestHandler } from "express";
import { Table } from "@chevtek/poker-engine";
import PokerRoom from "../models/PokerRoom";

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
