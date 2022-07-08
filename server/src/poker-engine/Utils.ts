import { Player } from "@chevtek/poker-engine";

/**
 * Given a optional nullable player, returns true when the player exists and
 * has chips to play.
 *
 * @param player a optional nullable player
 * @returns true when the player has chips to play, false otherwise.
 */
const hasChips = (player?: Player | null) => player && player.stackSize > 0;

/**
 * Given an optional nullable player, returns true when the player exists and
 * hasn't left.
 *
 * @param player an optional nullable player
 * @returns true when the player hasn't left, false otherwise.
 */
const isStaying = (player?: Player | null) => player?.left === false;

/**
 * Given a nullable player, returns true when the player exists and will
 * be participating in the next round (i.e. hasn't left and has chips).
 *
 * @param player a nullable player
 * @returns true when the player will be participating in the next round
 */
const willPlayerParticipateInNextRound = (player?: Player | null) =>
  hasChips(player) && isStaying(player);

/**
 * Given a Player, returns true when Player.table.dealCards can be
 * called a) without throwing an exception and b) it is appropriate
 * to do so given game conditions; false otherwise.
 *
 * This code is meant to duplicate some of the internal validation
 * that Table.dealCards uses.
 *
 * @param p a Player
 * @returns true when player can deal, false otherwise
 */
export const canDealCards = (p: Player) => {
  const {
    table: { dealer, currentRound, players },
  } = p;
  return (
    !currentRound &&
    players.filter(willPlayerParticipateInNextRound).length >= 2 &&
    willPlayerParticipateInNextRound(p) &&
    (p === dealer || !willPlayerParticipateInNextRound(dealer))
  );
};
