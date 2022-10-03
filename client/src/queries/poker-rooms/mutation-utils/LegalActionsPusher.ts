import { PokerRooms } from "@pokester/common-api";

type LegalActions = PokerRooms.Act.PlayerAction[];
type Player = PokerRooms.Get.Player | null;

export const pushPlayerLegalActions = (
  player: Player,
  legalActions: LegalActions
): boolean => {
  if (!player?.isSelf) {
    return false;
  }
  player.legalActions = legalActions;
  return true;
};

export const pushPlayersLegalActions = (
  players: Player[],
  legalActions: LegalActions
): void => {
  players.reduce((prevPushed, player) => {
    const pushed = pushPlayerLegalActions(player, legalActions);
    if (pushed && prevPushed) {
      throw new Error("legalActions cannot be pushed on multiple players");
    }
    return pushed || prevPushed;
  }, false as boolean);
  return;
};

type Pot = PokerRooms.Get.Pot;
export const pushPotLegalActions = (
  pot: Pot,
  legalActions: LegalActions
): void => pushPlayersLegalActions(pot.eligiblePlayers, legalActions);

export const pushPotsLegalActions = (
  pots: Pot[],
  legalActions: LegalActions
): void => pots.forEach((pot) => pushPotLegalActions(pot, legalActions));

type Table = PokerRooms.Get.Table;
export const pushTableLegalActions = (
  table: Table,
  legalActions?: LegalActions
): void => {
  if (!legalActions) return;
  const { players, pots } = table;
  pushPlayersLegalActions(players, legalActions);
  pushPotsLegalActions(pots, legalActions);
  return;
};

export default pushTableLegalActions;
