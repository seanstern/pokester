import { Card as PokerEngineCard } from "@chevtek/poker-engine";
import { Card as CommonAPICard } from "common-api";

/**
 * Given a poker-engine (i.e. server-side runtime) representation of a Card,
 * returns a common-api (i.e. serializable, server-to-client) representaiton
 * of a Card.
 * @param c a poker-engine (i.e. server-side runtime) representatio of a Card
 * @returns a common-api (i.e. serializable, server-to-client) representation
 *   of a Card
 */
export const playerView = (c: PokerEngineCard): CommonAPICard => {
  const { rank, suit, color, suitChar } = c;
  return { rank, suit, color, suitChar };
};
