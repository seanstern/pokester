import Box from "@mui/material/Box";
import { PokerRooms } from "@pokester/common-api";
import { FC, useRef } from "react";
import PlayingCard from "../../playing-card";

export type HoleCardsProps = {
  holeCards?: PokerRooms.Get.Player["holeCards"];
  roundInProgress: boolean;
  winner: boolean;
  folded: boolean;
};

/**
 * Given an object that contains
 *   - whether or not the player has folded
 *   - a player's displayed hole cards
 *   - whether or not a round is in progress
 *   - whether or not the player is a winner
 * returns an array of cards to be displayed--the array will consist of
 *   - two Cards when cards are visible
 *   - two nulls when cards are hidden
 *   - no entries when no cards
 *
 * @param param
 * @param param.folded boolean indicating whether or not the player has folded
 * @param param.holeCards hole cards a player is displaying; note that this
 *   value is undefined in any circumstance where the player is not displaying
 *   the value of their hole cards publicly (e.g. when they have folded and have
 *   no cards, when they have left and have no cards, or when they have
 *   **private** hole cards)
 * @param param.roundInProgress boolean indicating whether or not a round is in
 *   progress
 * @param param.winner boolean indicating whether or not a player is a winner of
 *   the round
 * @returns an array of cards to be displayed--the array will consist of
 *   - two Cards when cards are visible
 *   - two nulls when cards are hidden
 *   - no entries when no cards
 */
export const displayedCards = ({
  holeCards,
  roundInProgress,
  winner,
  folded,
}: HoleCardsProps):
  | [PokerRooms.Get.Card, PokerRooms.Get.Card]
  | [null, null]
  | [] => {
  if (!folded && holeCards) return holeCards;
  else if (!folded && (roundInProgress || winner)) return [null, null];
  return [];
};

/**
 * Given props, returns hole cards.
 *
 * @param props
 * @param props.holeCards hole cards a player is displaying; note that this
 *   value is undefined in any circumstance where the player is not displaying
 *   the value of their hole cards publicly (e.g. when they have folded and
 *   have no cards, when they have left and have no cards, or when they have
 *   **private** hole cards).
 * @param props.isRoundInProgress boolean indicating whether or not a round
 *   is in progress
 * @param props.isWinner boolean indicating whether or not a player is a winner
 *   of the round
 * @param props.folded boolean indicating whether or not the player has folded
 * @returns hole cards
 */
const HoleCards: FC<HoleCardsProps> = (props) => {
  const containerRef = useRef(null);

  return (
    <Box
      minHeight={28}
      display="flex"
      width={1}
      ref={containerRef}
      overflow="hidden"
    >
      {displayedCards(props).map((hc, idx) => (
        <PlayingCard
          key={idx}
          visible={hc}
          containerRef={containerRef}
          dealt={props.roundInProgress}
        />
      ))}
    </Box>
  );
};

export default HoleCards;
