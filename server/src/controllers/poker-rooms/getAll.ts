import { ReqQuery, ResBody } from "@pokester/common-api/poker-rooms/get-all";
import { RequestHandler } from "express";
import RegistrationExtension from "../../middleware/request-extensions/RegistrationExtension";
import PokerRoom from "../../models/PokerRoom/index";

export { ReqQuery, ResBody };

const escapeEmbeddedRegExpStr = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Given a string, returns a query operator for prefix matching based on the
 * given string.
 */
export const prefixMatchQueryOp = (str: string) => ({
  $regex: new RegExp(`^${escapeEmbeddedRegExpStr(str)}`),
});

/**
 * Given an HTTP request to get PokerRooms (including optional filters),
 * an HTTP response, and a callback, attempts to respond with a JSON
 * representation of the PokerRooms. Responds with a status of 200 and
 * JSON representation of the PokerRooms when successful; calls the callback
 * with error information upon failure.
 *
 * @param req  an HTTP request
 * @param req.query the query string parameters, representing the filters; a
 *   well specified query will be of type {@linkcode ReqQuery}
 * @param res the HTTP response
 * @param next the callback
 */
export const getAll: RequestHandler<
  Record<string, never>,
  ResBody,
  undefined,
  ReqQuery
> = async (req, res, next) => {
  try {
    const {
      user: { username },
    } = RegistrationExtension.get(req);

    const {
      query: { creatorId, name, canSit, isSeated },
    } = req;

    const mutablePokerRoomsQuery = PokerRoom.find();
    if (name) {
      mutablePokerRoomsQuery.where({
        name: prefixMatchQueryOp(name),
      });
    }
    if (creatorId) {
      mutablePokerRoomsQuery.where({
        creatorId: prefixMatchQueryOp(creatorId),
      });
    }
    if (canSit && ["false", "true"].includes(canSit)) {
      mutablePokerRoomsQuery.byCanPlayerSit(username, canSit === "true");
    }
    if (isSeated && ["false", "true"].includes(isSeated)) {
      mutablePokerRoomsQuery.byIsPlayerSeated(username, isSeated === "true");
    }
    mutablePokerRoomsQuery.select({
      name: 1,
      playerIds: 1,
      creatorId: 1,
    });

    const pokerRooms = await mutablePokerRoomsQuery.exec();

    const pokerRoomsResponse: ResBody = pokerRooms.map((pr) => {
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
        canSit: pr.canSit(username),
        isSeated: pr.isSeated(username),
      };
    });

    res.status(200).json(pokerRoomsResponse);
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default getAll;
