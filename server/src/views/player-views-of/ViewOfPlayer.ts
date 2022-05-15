import { Player as PokerEnginePlayer } from "@chevtek/poker-engine";
import {
  Player as CommonAPIPlayer,
  Card as CommonAPICard,
  PlayerAction,
} from "common-api";
import viewOfCard from "./ViewOfCard";

/**
 * Given a poker-engine (i.e. server-side runtime) representation of the
 * holeCards for a Player, returns a common-api (i.e. serializable,
 * server-to-client) representaiton of holeCards from the perspective
 * of a player. Should only be called when player is viewing
 *   - themself (a player can always see their own hole cards)
 *   - an opponent who is deliberately showing cards
 * @param pokerEngineHoleCards a poker-engine (i.e. server-side runtime)
 *   representation of the holeCards for a Player (assumed to be the
 *   the same as the viewer).
 * @returns a common-api (i.e. serializable, server-to-client) representation
 *   of holeCards
 */
const viewOfHoleCards = (
  pokerEngineHoleCards: PokerEnginePlayer["holeCards"]
): [CommonAPICard, CommonAPICard] | undefined => {
  if (!pokerEngineHoleCards) {
    return pokerEngineHoleCards;
  }
  return pokerEngineHoleCards.map((pokerEngineHoleCard) =>
    viewOfCard(pokerEngineHoleCard)
  ) as [CommonAPICard, CommonAPICard];
};

/**
 * Given a poker-engine (i.e. server-side runtime) representation of a Player,
 * returns a common-api (i.e. serializable, server-to-client) representation
 * of the legalActions from the perspective of a player. Should only be called
 * when a player is viewing themself.
 * @param p a poker-engine (i.e. server-side runtime) representation of a
 *   Player
 * @returns a common-api (i.e. serializable, server-to-client) representation
 *   of the legalActions the Player can take
 */
const viewOfLegalActions = (
  p: PokerEnginePlayer
): PlayerAction[] | undefined => {
  if (p.table.currentActor !== p) {
    return undefined;
  }
  return p.legalActions() as PlayerAction[];
};

/**
 * Given the id of the player requesting the view and a poker-engine (i.e.
 * server-side runtime) representation of a Player, returns a common-api (i.e
 * serializable, server-to-client) representation of a the Player from the
 * perspective of a player
 * @param viewerId the id of the player requesting the view
 * @param p a poker-engine (i.e. server-side runtime) representation of a
 *   Player
 * @returns a common-api (i.e. serializable, server-to-client) representation
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

  return {
    bet,
    folded,
    left,
    id,
    stackSize,
    isSelf,
    holeCards:
      isSelf || showCards ? viewOfHoleCards(pokerEngineHoleCards) : undefined,
    legalActions: isSelf ? viewOfLegalActions(p) : undefined,
  };
};

export default viewOfPlayer;
