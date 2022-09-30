import { Table } from "@chevtek/poker-engine";
import { ReqBody } from "@pokester/common-api/poker-rooms/create";
import createReqBodySchema from "@pokester/common-api/poker-rooms/create/reqBodySchema";
import { RequestHandler } from "express";
import RegistrationExtension from "../../middleware/request-extensions/RegistrationExtension";
import PokerRoom from "../../models/PokerRoom/index";

export type { ReqBody };

/**
 * Given an HTTP request to create a new PokerRoom, an HTTP response, and a
 * callback, attempts to create a new PokerRoom. Responds with a status of
 * 201 and a json string representing the id of the PokerRoom when successful;
 * calls the callback with error information upon failure.
 * @param req  an HTTP request
 * @param req.body the body of the HTTP request; a well specified body will
 *  be of {@linkcode ReqBody} type
 * @param res the HTTP response
 * @param next the callback
 */
const create: RequestHandler<Record<string, never>, string, ReqBody> = async (
  req,
  res,
  next
) => {
  try {
    const {
      user: { username },
    } = RegistrationExtension.get(req);

    const { name, buyIn, smallBlind, bigBlind } =
      createReqBodySchema.validateSync(req.body);

    const table = new Table(buyIn, smallBlind, bigBlind);
    table.sitDown(username, table.buyIn);

    const pr = new PokerRoom({
      name,
      creatorId: username,
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

export default create;
