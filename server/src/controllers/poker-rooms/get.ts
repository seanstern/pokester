import { ResBody } from "@pokester/common-api/poker-rooms/get";
import { RequestHandler } from "express";
import RegistrationExtension from "../../middleware/request-extensions/RegistrationExtension";
import PokerRoom from "../../models/PokerRoom/index";
import viewOfTable from "../../views/player-views-of/ViewOfTable";
import { pokerRoomNotFound } from "./ErrorMessages";

export { pokerRoomNotFound, ResBody };

export type ReqParams = {
  roomId: string;
};

/**
 * Given an HTTP request to get a PokerRoom, an HTTP response, and a
 * callback, attempts to respond with a JSON representation of the
 * PokerRoom. Responds with a status of 200 and JSON representation of
 * the PokerRoom when successful; responds with a status of 404 and a string
 * when the PokerRoom cannot be found; calls the callback with error information
 * upon other failure.
 * @param req  an HTTP request
 * @param req.params the route parametes; a well specified set of route
 *   parameters will be of type {@linkcode ReqParams}
 * @param res the HTTP response
 * @param next the callback
 */
const get: RequestHandler<ReqParams, ResBody | string> = async (
  req,
  res,
  next
) => {
  try {
    const {
      user: { username },
    } = RegistrationExtension.get(req);

    const {
      params: { roomId },
    } = req;

    const pr = await PokerRoom.findOne({
      _id: roomId,
    }).exec();
    if (!pr?.name || !pr?.table) {
      res.status(404).send(pokerRoomNotFound);
      return;
    }

    const { name, table } = pr;
    res.status(200).json({
      id: roomId,
      name,
      table: viewOfTable(username, table),
      canSit: pr.canSit(username),
    });
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default get;
