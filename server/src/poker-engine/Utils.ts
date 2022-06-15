import { Player } from "@chevtek/poker-engine";

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
    table: { dealer, activePlayers, currentRound },
  } = p;
  return dealer === p && activePlayers.length >= 2 && !currentRound;
};
