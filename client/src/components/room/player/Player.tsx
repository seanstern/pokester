import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";
import useCurrencyColor from "../useCurrencyColor";
import BetOrWinningsSection, {
  betLabel,
  winningsLabel,
} from "./BetOrWinningsSection";
import CardsSection from "./cards-section";
import PositionsSection, { BlindPosition } from "./PositionsSection";
import StackSection from "./StackSection";

export type PlayerProps = PokerRooms.Get.Player & {
  blindPosition?: BlindPosition;
  currentActor: boolean;
  dealer: boolean;
  roundInProgress: boolean;
  seatNumber: number;
  winnings?: number;
};

/**
 * Given an object containing
 *   - whether or not a player is the current actor
 *   - whether or not a player folded
 *   - an indication of whether or not a player left
 *   - whether or not a player is a wnner
 * returns text for ToolTip for Player (or null if no ToolTip is needed).
 *
 * @param param
 * @param param.currentActor boolean indicating whether or not the player is the
 *   current actor in the roudn (i.e. it is this player's turn)
 * @param param.folded boolean indicating whether or not the player has folded
 * @param param.left boolean indicating whether or not the player has left the
 *   table
 * @param param.winner boolean indicating whether or not hte player is a winner
 *   of the round
 * @returns text for ToolTip for Player (or null if no ToolTip is needed)
 */
export const toToolTipText = ({
  left,
  folded,
  currentActor,
  winner,
}: Pick<PlayerProps, "currentActor" | "folded" | "left"> & {
  winner: boolean;
}) =>
  left
    ? "Left Table"
    : folded
    ? "Folded"
    : currentActor
    ? "Current Actor"
    : winner
    ? "Winner"
    : null;

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
 * Given whether or not a player is a winner, returns appropriate label for
 * bet or winnings section.
 *
 * @param winner whether or not a player is a winner
 * @returns appropriate label for bet or winnings section
 */
export const getBetOrWinningsLabel = (winner: boolean) =>
  winner ? winningsLabel : betLabel;

/**
 * Given whether or not a round is in progress and whether or not a player is
 * a winner, return true when the bet or winnings sction should be displayed;
 * false otherwise.
 *
 * @param roundInProgress whether or not a round is in progress
 * @param winner whether or not a player is a winner
 * @returns true when the bet or winnings sction should be displayed; false
 *  otherwise.
 */
export const displayBetOrWinningsSection = (
  roundInProgress: boolean,
  winner: boolean
) => roundInProgress || winner;

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
 * @param props.blindPosition optional indication of the player's blind
 *   position
 * @param props.currentActor boolean indicating whether or not the player
 *   is the current actor in the round (i.e. it is this player's turn)
 * @param props.dealer boolean indicating whether or not the player is the
 *   dealer in the current round
 * @param props.roundInProgress boolean indicating whether or not a round
 *   is in progress
 * @param props.seatNumber number indicating the seat a current player is
 *   sitting in
 * @param props.winnings optional number indicating the amount of money the
 *   player has won at the end of the round
 * @returns a player at a table
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
  currentActor,
  dealer,
  roundInProgress,
  seatNumber,
  winnings,
}) => {
  const currencyColor = useCurrencyColor();

  const leftOrFolded = left || folded;

  const playerCurrencyColor = leftOrFolded ? undefined : currencyColor;

  const positionChipColor = leftOrFolded ? "default" : "secondary";

  const defaultFontColor = left
    ? "text.disabled"
    : folded
    ? "text.secondary"
    : undefined;

  const idFontColor = isSelf && !left ? "primary.main" : undefined;

  const sectionLabelId = `player-id-${seatNumber}`;

  const winner = hasWinnings(winnings);

  const elevation = currentActor || winner ? 16 : left ? 0 : 1;

  return (
    <Tooltip
      describeChild={true}
      title={
        toToolTipText({
          left,
          folded,
          currentActor,
          winner,
        }) || ""
      }
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
              <Box mx={1}>
                <PositionsSection
                  blindPosition={blindPosition}
                  chipColor={positionChipColor}
                  dealer={dealer}
                />
              </Box>
            </Box>
          </Box>
          <Box ml="auto" maxWidth={3 / 5} minHeight={26}>
            <StackSection
              amount={stackSize}
              currencyColor={playerCurrencyColor}
            />
          </Box>
        </Box>
        <Box display="flex" minHeight={48}>
          <Box minWidth={1 / 5}>
            <CardsSection
              seatNumber={seatNumber}
              holeCards={holeCards}
              winner={winner}
              roundInProgress={roundInProgress}
              folded={folded}
            />
          </Box>
          <Box marginLeft="auto" maxWidth={4 / 5}>
            {(roundInProgress || winner) && (
              <BetOrWinningsSection
                seatNumber={seatNumber}
                label={getBetOrWinningsLabel(winner)}
                amount={winner ? winnings : bet}
                currencyColor={playerCurrencyColor}
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default Player;
