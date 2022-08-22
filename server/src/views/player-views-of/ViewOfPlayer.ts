import { Player as PokerEnginePlayer } from "@chevtek/poker-engine";
import {
  Card,
  Player as CommonAPIPlayer,
  PlayerAction,
} from "@pokester/common-api/poker-rooms/get";
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
  holeCards: PokerEnginePlayer["holeCards"]
): [Card, Card] | undefined => {
  if (!holeCards) {
    return holeCards;
  }
  return holeCards.map((holeCard) => viewOfCard(holeCard)) as [Card, Card];
};

/**
 * Given a poker-engine (i.e. server-side runtime) representation of a Player,
 * returns a @pokester/common-api (i.e. serializable, server-to-client)
 * representation of the legalActions from the perspective of a player.
 *
 * These elements of the returned array may differ subtly from
 * {@link PokerEnginePlayer.legalActions} (i.e. may include
 * {@link ActPlayerAction} values which have no corresponding
 * representation in {@link PokerEnginePlayer.legalActions}.
 *
 * Should only be called when a player is viewing themself.
 *
 * @param p a poker-engine (i.e. server-side runtime) representation of a
 *   Player
 * @returns a @pokester/common-api (i.e. serializable, server-to-client) representation
 *   of the legalActions the Player can take
 */
const viewOfLegalActions = (
  p: PokerEnginePlayer
): PlayerAction[] | undefined => {
  const legalActions: PlayerAction[] = [];

  if (!p.left) {
    legalActions.push(PlayerAction.STAND);
  }

  if (canDealCards(p)) {
    legalActions.push(PlayerAction.DEAL);
  }

  if (p.table.currentActor === p) {
    legalActions.push(...(p.legalActions() as PlayerAction[]));
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
  p: PokerEnginePlayer
): CommonAPIPlayer => {
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
    handDescr: canViewHoleCards ? p.hand?.descr : undefined,
  };
};

export default viewOfPlayer;
