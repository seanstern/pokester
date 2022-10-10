import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";
import PlayingCard from "../playing-card";
import toCurrencyFormat from "../toCurrencyFormat";
import useCurrencyColor from "../useCurrencyColor";
import cardToString, { CardString } from "../cardToString";

export const positionsRegionLabel = "Position(s)";
export const dealerChipText = "D";
export const smallBlindChipText = "S";
export const bigBlindChipText = "B";
export const stackRegionLabel = "Stack";
export const cardsRegionLabel = "Cards";
export const betRegionLabel = "Bet";
export const winningsRegionLabel = "Winnings";

/**
 * Given a numerical stack, returns a string representation of the stack.
 *
 * @param amt a numerical stack
 * @returns a string representation of the stack
 */
export const stackToCurrencyFormat = toCurrencyFormat;

/**
 * Given a number, returns a currency formatted representaiton of the number
 * when it's positive; null otherwise.
 *
 * @param num a number
 * @returns a currency
 */
export const positiveNumToCurrencyFormat = (num: number) =>
  num > 0 ? toCurrencyFormat(num) : null;

/**
 * Given a player's displayed hole cards, whether or not a round is in progress,
 * whether or not the player is a winner, and whether or not the player has
 * folded, returns a tuple of string representations of each of the player's
 * cards.
 *
 * @param holeCards hole cards a player is displaying; note that this value is
 *   undefined in any circumstance where the player is not displaying the value
 *   of their hole cards publicly (e.g. when they have folded and have no cards,
 *   when they have left and have no cards, or when they have **private** hole
 *   cards).
 * @param isRoundInProgress boolean indicating whether or not a round is in
 *   progress
 * @param isWinner boolean indicating whether or not a player is a winner of
 *   the round
 * @param folded boolean indicating whether or not the player has folded
 * @returns a string representation of each card as a tuple
 */
export const holeCardsToStrings = (
  holeCards: PokerRooms.Get.Player["holeCards"],
  isRoundInProgress: boolean,
  isWinner: boolean,
  folded: boolean
): [CardString, CardString] | ["🃏", "🃏"] | [null, null] => {
  if (!folded && holeCards)
    return [cardToString(holeCards[0]), cardToString(holeCards[1])];
  else if (!folded && (isRoundInProgress || isWinner)) return ["🃏", "🃏"];
  return [null, null];
};

/**
 * Given an indication of whether or not a player left, whether or not a player
 * folded, whether or not a player is the current actor, and whether or not
 * a player is a wnner, returns text for ToolTip for Player (or null if no
 * ToolTip is needed).
 *
 * @param left boolean indicating whether or not the player has left the table
 * @param folded boolean indicating whether or not the player has folded
 * @param isCurrentActor boolean indicating whether or not the player is the
 *   current actor in the roudn (i.e. it is this player's turn)
 * @param isWinner boolean indicating whether or not hte player is a winner of
 *   the round
 * @returns text for ToolTip for Player (or null if no ToolTip is needed)
 */
export const toToolTipText = (
  left: boolean,
  folded: boolean,
  isCurrentActor: boolean,
  isWinner: boolean
) =>
  left
    ? "Left Table"
    : folded
    ? "Folded"
    : isCurrentActor
    ? "Current Actor"
    : isWinner
    ? "Winner"
    : null;

type HoleCardsProps = {
  holeCards: PokerRooms.Get.Player["holeCards"];
  isRoundInProgress: boolean;
  isWinner: boolean;
  folded: boolean;
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
const HoleCards: FC<HoleCardsProps> = ({
  holeCards,
  isRoundInProgress,
  isWinner,
  folded,
}) => (
  <Box minHeight={28} display="flex" width={1}>
    {holeCardsToStrings(holeCards, isRoundInProgress, isWinner, folded).map(
      (hcText, idx) =>
        hcText === "🃏" ? (
          <Typography key={idx} variant="body1">
            {hcText}
          </Typography>
        ) : !!hcText ? (
          <PlayingCard key={idx} value={hcText} color={holeCards![idx].color} />
        ) : null
    )}
  </Box>
);

/**
 * Given an optional amount of winnings, returns true where there are winnings;
 * false otherwie.
 *
 * @param winnings optional amount of winnings
 * @returns true when winnings is positive; false otherwise
 */
export const hasWinnings = (winnings?: number): winnings is number =>
  (winnings ?? 0) > 0;

/**
 * Given a boolean indicating whether or not a round is in progress and a
 * boolean indicating whether or not a player is a winner, returns true when the
 * cards and amount regions should be displayed; false otherwise.
 *
 * @param isRoundInProgress a boolean indicating whether or not a round is in
 *   progress
 * @param isWinner a boolean indicating whether or not a player is a winner
 * @returnstrue when the cards and amount regions should be displayed; false
 *   otherwise
 */
export const displayCardsAndAmount = (
  isRoundInProgress: boolean,
  isWinner: boolean
) => isRoundInProgress || isWinner;

export enum BlindPosition {
  SMALL = "Small Blind",
  BIG = "Big Blind",
}

export type PlayerProps = PokerRooms.Get.Player & {
  blindPosition?: BlindPosition;
  isCurrentActor: boolean;
  isDealer: boolean;
  isRoundInProgress: boolean;
  seatNumber: number;
  winnings?: number;
};
/**
 * Given props, returns a player at a table.
 *
 * @param props
 * @param props.bet amount of currency the player has bet in the current round
 * @param props.folded boolean indicating whether or not the player has folded
 * @param props.left boolean indicating whether or not the player has left the
 *   table
 * @param props.id the identity of the player
 * @param props.stackSize amount of currency the player has in their stack
 * @param props.holeCards hole cards a player is displaying; note that this
 *   value is undefined in any circumstance where the player is not displaying
 *   the value of their hole cards publicly (e.g. when they have folded and
 *   have no cards, when they have left and have no cards, or when they have
 *   **private** hole cards).
 * @param props.isSelf boolean indicating whether or not the player represents
 *   the user (i.e. a representation of the user's self at the table)
 * @param props.blindPosition optional string indication of the player's blind
 *   position (i.e. "Small Blind" when the player is in the small blind
 *   position, "Big Blind" when the player is in the big blind position)
 * @param props.isCurrentActor boolean indicating whether or not the player
 *   is the current actor in the roudn (i.e. it is this player's turn)
 * @param props.isDealer boolean indicating whether or not the player is the
 *   dealer in the current round
 * @param props.isRoundInProgress boolean indicating whether or not a round
 *   is in progress
 * @param props.seatNumber number indicating the seat a current player is
 *   sitting in
 * @param props.winnings optional number indicating the amount of money the
 *   player has won at the end of the round
 * @returns a Player at a table
 */
const Player: FC<PlayerProps> = ({
  bet,
  folded,
  left,
  id,
  stackSize,
  holeCards,
  isSelf,
  blindPosition,
  isCurrentActor,
  isDealer,
  isRoundInProgress,
  seatNumber,
  winnings,
}) => {
  const currencyColor = useCurrencyColor();
  const playerCurrencyColor = left || folded ? undefined : currencyColor;
  const positionChipColor = left || folded ? "default" : "secondary";
  const defaultFontColor = left
    ? "text.disabled"
    : folded
    ? "text.secondary"
    : undefined;
  const idFontColor = isSelf && !left ? "primary.dark" : undefined;
  const sectionLabelId = `player-id-${seatNumber}`;

  const cardsLabelId = `player-cards-${seatNumber}`;
  const isWinner = hasWinnings(winnings);
  const betOrWinningsProps = isWinner
    ? {
        labelId: `player-winnings-${seatNumber}`,
        label: winningsRegionLabel,
        amountFontWeight: "bold",
        amount: winnings,
      }
    : {
        labelId: `player-bet-${seatNumber}`,
        label: betRegionLabel,
        amountFontWeight: undefined,
        amount: bet,
      };
  const elevation = isCurrentActor || isWinner ? 16 : left ? 0 : 1;
  return (
    <Tooltip
      describeChild={true}
      title={toToolTipText(left, folded, isCurrentActor, isWinner) || ""}
      followCursor
    >
      <Paper
        component="section"
        sx={{ padding: 1, color: defaultFontColor }}
        elevation={elevation}
        aria-labelledby={sectionLabelId}
      >
        <Box display="flex" alignItems="flex-start">
          <Box minWidth={2 / 5}>
            <Box display="flex" minHeight={26}>
              <Typography
                component="h2"
                variant="body1"
                noWrap
                color={idFontColor}
                id={sectionLabelId}
              >
                {id}
              </Typography>
              <Box
                mx={1}
                display="flex"
                component="section"
                aria-label={positionsRegionLabel}
              >
                {isDealer && (
                  <Chip
                    size="small"
                    label={dealerChipText}
                    color={positionChipColor}
                  />
                )}
                {blindPosition && (
                  <Chip
                    size="small"
                    label={
                      blindPosition === BlindPosition.BIG
                        ? bigBlindChipText
                        : smallBlindChipText
                    }
                    color={positionChipColor}
                    aria-label={blindPosition}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Box
            ml="auto"
            maxWidth={3 / 5}
            component="section"
            aria-label={stackRegionLabel}
            minHeight={26}
          >
            <Typography
              variant="body1"
              noWrap
              color={playerCurrencyColor}
              textAlign="right"
            >
              {toCurrencyFormat(stackSize)}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" minHeight={48}>
          {displayCardsAndAmount(isRoundInProgress, isWinner) && (
            <>
              <Box
                component="section"
                minWidth={1 / 5}
                aria-labelledby={cardsLabelId}
              >
                <Typography component="h3" variant="caption" id={cardsLabelId}>
                  {cardsRegionLabel}
                </Typography>
                <HoleCards
                  {...{ isWinner, isRoundInProgress, folded, holeCards }}
                />
              </Box>
              <Box
                marginLeft="auto"
                maxWidth={4 / 5}
                component="section"
                aria-labelledby={betOrWinningsProps.labelId}
              >
                <Typography
                  component="h3"
                  textAlign="right"
                  variant="caption"
                  id={betOrWinningsProps.labelId}
                >
                  {betOrWinningsProps.label}
                </Typography>
                <Typography
                  color={playerCurrencyColor}
                  noWrap
                  variant="body1"
                  fontWeight={isWinner ? "bold" : undefined}
                  textAlign="right"
                >
                  {positiveNumToCurrencyFormat(betOrWinningsProps.amount) || (
                    <>&nbsp;</>
                  )}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default Player;
