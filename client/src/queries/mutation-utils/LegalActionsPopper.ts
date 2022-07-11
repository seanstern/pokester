import { Routes } from "@pokester/common-api";

export type LegalActions = Routes.PokerRooms.Act.PlayerAction[] | undefined;
type Player = Routes.PokerRooms.Get.Player | null;

export const popPlayerLegalActions = (player: Player): LegalActions => {
  if (!player?.isSelf) {
    return undefined;
  }
  const { legalActions } = player;
  player.legalActions = undefined;
  return legalActions;
};

export const popPlayersLegalActions = (players: Player[]): LegalActions =>
  players.reduce((prevLegalActions, player) => {
    const playerLegalActions = popPlayerLegalActions(player);
    if (prevLegalActions && playerLegalActions) {
      throw new Error("players cannot contain two elements with legalActions");
    }
    return prevLegalActions || playerLegalActions;
  }, undefined as LegalActions);

type Pot = Routes.PokerRooms.Get.Pot;
export const popPotLegalActions = (pot: Pot): LegalActions =>
  popPlayersLegalActions(pot.eligiblePlayers);

const doDefinedLegalActionsDiffer = (
  a: Exclude<LegalActions, undefined>,
  b: Exclude<LegalActions, undefined>
): boolean =>
  a.length !== b.length ||
  a.reduce((allMatch, el, idx) => allMatch && el !== b[idx], true as boolean);

export const popPotsLegalActions = (pots: Pot[]): LegalActions =>
  pots.reduce((prevLegalActions, pot) => {
    const potLegalActions = popPotLegalActions(pot);
    if (
      prevLegalActions &&
      potLegalActions &&
      doDefinedLegalActionsDiffer(prevLegalActions, potLegalActions)
    ) {
      throw new Error("pots cannot contain two differnt sets of legalAction");
    }
    return potLegalActions;
  }, undefined as LegalActions);

type Table = Routes.PokerRooms.Get.Table;
export const popTableLegalActions = (table: Table): LegalActions => {
  const { players, pots } = table;
  const playersLegalActions = popPlayersLegalActions(players);
  const potsLegalActions = popPotsLegalActions(pots);
  if (
    playersLegalActions &&
    potsLegalActions &&
    doDefinedLegalActionsDiffer(playersLegalActions, potsLegalActions)
  ) {
    throw new Error(
      "pots and players cannot contain two differnt sets of legalAction"
    );
  }
  return playersLegalActions || potsLegalActions;
};

export default popTableLegalActions;
