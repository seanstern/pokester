import { Card as PokerEngineCard } from "@chevtek/poker-engine";
import { Card as CommonAPICard } from "@pokester/common-api/poker-rooms/get";

/**
 * Given a poker-engine (i.e. server-side runtime) representation of a Card,
 * returns a @pokester/common-api (i.e. serializable, server-to-client)
 * representaiton of a Card from the perspective of a player
 * @param c a poker-engine (i.e. server-side runtime) representatio of a Card
 * @returns a @pokester/common-api (i.e. serializable, server-to-client)
 *   representation of a Card from the perspective of a player
 */
const viewOfCard = (c: PokerEngineCard): CommonAPICard => {
  const { rank, suit, color, suitChar } = c;
  return { rank, suit, color, suitChar };
};

export default viewOfCard;
