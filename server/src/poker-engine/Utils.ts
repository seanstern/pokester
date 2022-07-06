import { Player } from "@chevtek/poker-engine";

/**
 * Given a nullable player, returns true when the player exists and has
 * chips to play.
 *
 * @param player a nullable player
 * @returns true when the player has chips to play, false otherwise.
 */
const hasChips = (player: Player | null) => player && player.stackSize > 0;

/**
 * Given a nullable player, returns true when the player exists and
 * hasn't left.
 *
 * @param player a nullable player
 * @returns true when the player hasn't left, false otherwise.
 */
const isStaying = (player: Player | null) => player?.left === false;

/**
 * Given a Player, returns true when Player is Player.table.dealer
 * and Player.table.dealCards can be called without throwing an
 * exception; false otherwise.
 *
 * This code is meant to duplicate some of the internal validation
 * that Table.dealCards uses.
 *
 * @param p a Player
 * @returns true when player is Player.table.dealer and
 *   Player.table.dealCards can be called without throwing an
 *   exception, false otherwise
 */
export const canDealCards = (p: Player) => {
  const {
    table: { dealer, currentRound, players },
  } = p;
  return (
    dealer === p &&
    !currentRound &&
    players.filter(isStaying).filter(hasChips).length >= 2
  );
};
