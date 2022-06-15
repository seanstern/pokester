import { Player } from "@chevtek/poker-engine";
import { Routes } from "@pokester/common-api";
import { canDealCards } from "../../poker-engine/Utils";
import viewOfCard from "./ViewOfCard";

/**
 * Given a poker-engine (i.e. server-side runtime) representation of the
 * holeCards for a Player, returns a @pokester/common-api (iIt's I.e. serializable,
 * server-to-client) representaiton of holeCards from the perspective
 * of a player. Should only be called when player is viewing
 *   - themself (a player can always see their own hole cards)
 *   - an opponent who is deliberately showing cards
 * @param holeCards a poker-engine (i.e. server-side runtime)
 *   representation of the holeCards for a Player (assumed to be the
 *   the same as the viewer).
 * @returns a @pokester/common-api (i.e. serializable, server-to-client) representation
 *   of holeCards
 */
const viewOfHoleCards = (
  holeCards: Player["holeCards"]
): [Routes.PokerRooms.Get.Card, Routes.PokerRooms.Get.Card] | undefined => {
  if (!holeCards) {
    return holeCards;
  }
  return holeCards.map((holeCard) => viewOfCard(holeCard)) as [
    Routes.PokerRooms.Get.Card,
    Routes.PokerRooms.Get.Card
  ];
};

/**
 * Given a poker-engine (i.e. server-side runtime) representation of a Player,
 * returns a @pokester/common-api (i.e. serializable, server-to-client)
 * representation of the legalActions from the perspective of a player.
 *
 * These elements of the returned array may differ subtly from
 * {@link Player.legalActions} (i.e. may include
 * {@link Routes.PokerRooms.Get.PlayerAction} values which have no corresponding
 * representation in {@link Player.legalActions}.
 *
 * Should only be called when a player is viewing themself.
 *
 * @param p a poker-engine (i.e. server-side runtime) representation of a
 *   Player
 * @returns a @pokester/common-api (i.e. serializable, server-to-client) representation
 *   of the legalActions the Player can take
 */
const viewOfLegalActions = (
  p: Player
): Routes.PokerRooms.Get.PlayerAction[] | undefined => {
  const legalActions: Routes.PokerRooms.Get.PlayerAction[] = [];

  if (canDealCards(p)) {
    legalActions.push(Routes.PokerRooms.Get.PlayerAction.DEAL);
  }

  if (p.table.currentActor === p) {
    legalActions.push(
      ...(p.legalActions() as Routes.PokerRooms.Get.PlayerAction[])
    );
  }

  return legalActions.length > 0 ? legalActions : undefined;
};

/**
 * Given the id of the player requesting the view and a poker-engine (i.e.
 * server-side runtime) representation of a Player, returns a @pokester/common-api (i.e
 * serializable, server-to-client) representation of a the Player from the
 * perspective of a player
 * @param viewerId the id of the player requesting the view
 * @param p a poker-engine (i.e. server-side runtime) representation of a
 *   Player
 * @returns a @pokester/common-api (i.e. serializable, server-to-client) representation
 *   of a Player from the perspective of a player
 */
const viewOfPlayer = (
  viewerId: string,
  p: Player
): Routes.PokerRooms.Get.Player => {
  const {
    bet,
    folded,
    left,
    id,
    stackSize,
    showCards,
    holeCards: pokerEngineHoleCards,
  } = p;

  const isSelf = p.id === viewerId;
  const canViewHoleCards = !folded && (isSelf || showCards);

  return {
    bet,
    folded,
    left,
    id,
    stackSize,
    isSelf,
    holeCards: canViewHoleCards
      ? viewOfHoleCards(pokerEngineHoleCards)
      : undefined,
    legalActions: isSelf ? viewOfLegalActions(p) : undefined,
  };
};

export default viewOfPlayer;
