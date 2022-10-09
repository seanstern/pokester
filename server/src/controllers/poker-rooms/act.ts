import { Player, Table } from "@chevtek/poker-engine";
import { PlayerAction, ReqBody } from "@pokester/common-api/poker-rooms/act";
import actReqBodySchema from "@pokester/common-api/poker-rooms/act/reqBodySchema";
import { RequestHandler } from "express";
import RegistrationExtension from "../../middleware/request-extensions/RegistrationExtension";
import PokerRoom from "../../models/PokerRoom/index";
import { canDealCards } from "../../poker-engine/Utils";
import { pokerRoomNotFound } from "./ErrorMessages";

export { pokerRoomNotFound, ReqBody };

enum PokerEngineErrorMessage {
  NO_AVAILABLE_SEATS = "No available seats!",
  ALREADY_PLAYER_IN_SEAT = "There is already a player in the requested seat.",
  ALREADY_JOINED = "Player already joined this table.",
  ACTION_OUT_OF_TURN = "Action invoked on player out of turn!",
  NO_PLAYER_FOUND = "No player found.",
  ILLEGAL_ACTION = "Illegal action.",
}

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
    throw new Error(PokerEngineErrorMessage.NO_PLAYER_FOUND);
  }
  return player as Player;
};

export enum BadRequestMessage {
  ACTION_OUT_OF_TURN = "It's not your turn yet.",
  ACTION_UNSEATED = "You haven't sat down yet.",
  SIT_ALREADY_SEATED = "You're already seated.",
  SIT_SEAT_TAKEN = "That seat has been taken.",
  SIT_FULL_TABLE = "The table's full.",
  ACTION_ILLEGAL = "That's not a legal action.",
}

const badReqMessageMap: Readonly<
  Record<PokerEngineErrorMessage, BadRequestMessage>
> = {
  [PokerEngineErrorMessage.NO_PLAYER_FOUND]: BadRequestMessage.ACTION_UNSEATED,
  [PokerEngineErrorMessage.ACTION_OUT_OF_TURN]:
    BadRequestMessage.ACTION_OUT_OF_TURN,
  [PokerEngineErrorMessage.ALREADY_JOINED]:
    BadRequestMessage.SIT_ALREADY_SEATED,
  [PokerEngineErrorMessage.ALREADY_PLAYER_IN_SEAT]:
    BadRequestMessage.SIT_SEAT_TAKEN,
  [PokerEngineErrorMessage.NO_AVAILABLE_SEATS]:
    BadRequestMessage.SIT_FULL_TABLE,
  [PokerEngineErrorMessage.ILLEGAL_ACTION]: BadRequestMessage.ACTION_ILLEGAL,
};

export type ReqParams = { roomId: string };

/**
 * Given an HTTP request to take a PlayerAction in PokerRoom, an HTTP response,
 * and a callback, attempts to take the action specified in the request.
 * Responds with a status of 204 when successful; responds with a status of 404
 * and a string when the PokerRoom cannot be found; responds with a status of
 * 400 and a string when action taken out of turn; calls the callback with error
 * information upon failure.
 * @param req  an HTTP request
 * @param req.params the route parametes; a well specified set of route
 *   parameters will be of {@linkcode ReqParams} type
 * @param req.body the action to be taken; a well specified body will be of
 *   {@linkcode ReqBody} type
 * @param res the HTTP response
 * @param next the callback
 */
export const act: RequestHandler<ReqParams, string, ReqBody> = async (
  req,
  res,
  next
) => {
  try {
    const {
      user: { username },
    } = RegistrationExtension.get(req as any);

    const {
      params: { roomId },
    } = req;

    const body = actReqBodySchema.validateSync(req.body);

    const pr = await PokerRoom.findOne({
      _id: roomId,
    }).exec();
    if (!pr?.table) {
      res.status(404).send(pokerRoomNotFound);
      return;
    }

    const { table, _id } = pr;

    try {
      switch (body.action) {
        case PlayerAction.SIT:
          pr.table.sitDown(username, table.buyIn, body.seatNumber);
          break;
        case PlayerAction.STAND:
          pr.table.standUp(username);
          break;
        case PlayerAction.DEAL:
          if (!canDealCards(findPlayer(username, table.players))) {
            throw new Error(PokerEngineErrorMessage.ILLEGAL_ACTION);
          }
          pr.table.dealCards();
          break;
        case PlayerAction.BET:
          findPlayer(username, table.players).betAction(body.amount);
          break;
        case PlayerAction.CALL:
          findPlayer(username, table.players).callAction();
          break;
        case PlayerAction.RAISE:
          findPlayer(username, table.players).raiseAction(body.amount);
          break;
        case PlayerAction.CHECK:
          findPlayer(username, table.players).checkAction();
          break;
        case PlayerAction.FOLD:
          findPlayer(username, table.players).foldAction();
          break;
        default:
          throw new Error(`action "${(body as any).action}" is invalid`);
      }
    } catch (err: any) {
      if (Object.values(PokerEngineErrorMessage).includes(err?.message)) {
        res
          .status(400)
          .send(badReqMessageMap[err.message as PokerEngineErrorMessage]);
        return;
      }
      throw err;
    }

    if (table.players.find((p) => !!p && !p.left)) {
      await pr.save();
    } else {
      await PokerRoom.deleteOne({ _id });
    }

    res.status(204).send();
    return;
  } catch (err) {
    next(err);
    return;
  }
};

export default act;
