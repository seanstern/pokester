import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";

export const positionsRegionLabel = "Position(s)";
export const dealerChipText = "D";
export const smallBlindChipText = "S";
export const bigBlindChipText = "B";
export const stackRegionLabel = "Stack";
export const cardsRegionLabel = "Cards";
export const betRegionLabel = "Bet";

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
/**
 * Given a numerical amount of money, return a string representation of the
 * amount.
 *
 * @param amt a numerical amount
 * @returns a string representation of the amount.
 */
const toCurrencyFormat = (amt: number) => currencyFormat.format(amt);

/**
 * Given a numerical stack, returns a string representation of the stack.
 *
 * @param amt a numerical stack
 * @returns a string representation of the stack
 */
export const stackToCurrencyFormat = toCurrencyFormat;

/**
 * Given a numerical bet, returns a string representation of the bet.
 *
 * @param bet a numerical bet
 * @returns a string representation of the bet
 */
export const betToCurrencyFormat = (bet: number) =>
  bet > 0 ? toCurrencyFormat(bet) : null;

/**
 * Given a player's displayed hole cards, whether or not a round is in progress,
 * and whether or not the player has folded, returns a tuple of string
 * representations of each card.
 *
 * @param holeCards hole cards a player is displaying; note that this value is
 *   undefined in any circumstance where the player is not displaying the value
 *   of their hole cards publicly (e.g. when they have folded and have no cards,
 *   when they have left and have no cards, or when they have **private** hole
 *   cards).
 * @param isRoundInProgress boolean indicating whether or not a round is in
 *   progress
 * @param folded boolean indicating whether or not the player has folded
 * @returns a tuple of string representations of each card
 */
export const holeCardsToText = (
  holeCards: PokerRooms.Get.Player["holeCards"],
  isRoundInProgress: boolean,
  folded: boolean
): [string, string] | [null, null] => {
  if (holeCards) holeCards.map(({ rank, suitChar }) => `${rank}${suitChar}`);
  else if (!folded && isRoundInProgress) return ["🎴", "🎴"];
  return [null, null];
};

/**
 * Given an indication of whether or not a player left, whether or not a player
 * folded, and whether or not a player is the current actor, returns text for
 * ToolTip for Player (or null if no ToolTip is needed).
 *
 * @param left boolean indicating whether or not the player has left the table
 * @param folded boolean indicating whether or not the player has folded
 * @param isCurrentActor boolean indicating whether or not the player is the
 *   current actor in the roudn (i.e. it is this player's turn)
 * @returns text for ToolTip for Player (or null if no ToolTip is needed)
 */
export const toToolTipText = (
  left: boolean,
  folded: boolean,
  isCurrentActor: boolean
) =>
  left
    ? "Left Table"
    : folded
    ? "Folded"
    : isCurrentActor
    ? "Current Actor"
    : null;

type HoleCardsProps = {
  holeCards: PokerRooms.Get.Player["holeCards"];
  isRoundInProgress: boolean;
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
 * @param props.folded boolean indicating whether or not the player has folded
 * @returns hole cards
 */
const HoleCards: FC<HoleCardsProps> = ({
  holeCards,
  isRoundInProgress,
  folded,
}) => (
  <>
    {holeCardsToText(holeCards, isRoundInProgress, folded).map(
      (hcText, idx) => (
        <Box
          key={idx}
          color={holeCards && holeCards[idx].color}
          component="span"
        >
          {hcText || <>&nbsp;</>}
        </Box>
      )
    )}
  </>
);

export enum BlindPosition {
  Small = "Small Blind",
  Big = "Big Blind",
}

export type PlayerProps = PokerRooms.Get.Player & {
  isDealer: boolean;
  isCurrentActor: boolean;
  blindPosition?: BlindPosition;
  isRoundInProgress: boolean;
  seatNumber: number;
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
 * @param props.isDealer boolean indicating whether or not the player is the
 *   dealer in the current round
 * @param props.isCurrentActor boolean indicating whether or not the player
 *   is the current actor in the roudn (i.e. it is this player's turn)
 * @param props.blindPosition optional string indication of the player's blind
 *   position (i.e. "Small Blind" when the player is in the small blind
 *   position, "Big Blind" when the player is in the big blind position)
 * @param props.isRoundInProgress boolean indicating whether or not a round
 *   is in progress
 * @param props.seatNumber number indicating the seat a current player is
 *   sitting in
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
  isDealer,
  isCurrentActor,
  blindPosition,
  isRoundInProgress,
  seatNumber,
}) => {
  const theme = useTheme();
  const currencyColor =
    left || folded
      ? undefined
      : theme.palette.mode === "dark"
      ? "lightgreen"
      : "darkgreen";
  const positionChipColor = left || folded ? "default" : "secondary";
  const topRowFontWeight = isSelf ? "bold" : undefined;
  const defaultFontColor = left
    ? "text.disabled"
    : folded
    ? "text.secondary"
    : undefined;
  const idFontColor = isSelf && !left ? "primary.dark" : undefined;
  const sectionLabelId = `id-${seatNumber}`;
  const cardsLabelId = `cards-${seatNumber}`;
  const betLabelId = `bet-${seatNumber}`;
  return (
    <Tooltip
      describeChild={true}
      title={toToolTipText(left, folded, isCurrentActor) || ""}
      followCursor
    >
      <Paper
        component="section"
        sx={{ padding: 1, color: defaultFontColor }}
        elevation={isCurrentActor ? 16 : left ? 0 : 1}
        aria-labelledby={sectionLabelId}
      >
        <Box display="flex" alignItems="flex-start">
          <Box minWidth={2 / 5}>
            <Box display="flex">
              <Typography
                component="h2"
                variant="body1"
                noWrap
                fontWeight={topRowFontWeight}
                color={idFontColor}
                id={sectionLabelId}
              >
                {id}
              </Typography>
              <Box mx={1} component="section" aria-label={positionsRegionLabel}>
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
                      blindPosition === BlindPosition.Big
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
          >
            <Typography
              variant="body1"
              noWrap
              fontWeight={topRowFontWeight}
              color={currencyColor}
              textAlign="right"
            >
              {toCurrencyFormat(stackSize)}
            </Typography>
          </Box>
        </Box>
        <Box display="flex">
          <Box
            component="section"
            minWidth={1 / 5}
            aria-labelledby={cardsLabelId}
          >
            <Typography component="h3" variant="caption" id={cardsLabelId}>
              {cardsRegionLabel}
            </Typography>
            <Typography noWrap variant="body2">
              <HoleCards {...{ isRoundInProgress, folded, holeCards }} />
            </Typography>
          </Box>
          <Box
            marginLeft="auto"
            maxWidth={4 / 5}
            component="section"
            aria-labelledby={betLabelId}
          >
            <Typography
              component="h3"
              textAlign="right"
              variant="caption"
              id={betLabelId}
            >
              {betRegionLabel}
            </Typography>
            <Typography color={currencyColor} noWrap variant="body2">
              {betToCurrencyFormat(bet) || <>&nbsp;</>}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default Player;
