import { Pot as PokerEnginePot } from "@chevtek/poker-engine";
import { Routes } from "common-api";
import viewOfPlayer from "./ViewOfPlayer";

/**
 * Given a poker-engine (i.e. server-side runtime) representation of a Pot,
 * returns a common-api (i.e. serializable, server-to-client) representaiton
 * of a Pot from the perspective of a player.
 * @param viewerId the id of the player requesting the view
 * @param p a poker-engine (i.e. server-side runtime) representatio of a Pot
 * @returns a common-api (i.e. serializable, server-to-client) representation
 *   of a Pot from the perspective of a player
 */
const viewOfPot = (
  viewerId: string,
  p: PokerEnginePot
): Routes.PokerRooms.Get.Pot => {
  const {
    amount,
    eligiblePlayers: pokerEngineEligiblePlayers,
    winners: pokerEngineWinners,
  } = p;
  return {
    amount,
    eligiblePlayers: pokerEngineEligiblePlayers.map(
      (pokerEngineEligiblePlayer) =>
        viewOfPlayer(viewerId, pokerEngineEligiblePlayer)
    ),
    winners: pokerEngineWinners
      ? pokerEngineWinners.map((pokerEngineWinner) =>
          viewOfPlayer(viewerId, pokerEngineWinner)
        )
      : undefined,
  };
};

export default viewOfPot;
