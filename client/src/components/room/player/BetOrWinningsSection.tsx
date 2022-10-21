import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { FC } from "react";
import toCurrencyFormat from "../toCurrencyFormat";

/**
 * Given a number, returns a currency formatted representaiton of the number
 * when it's positive; null otherwise.
 *
 * @param num a number
 * @returns a currency
 */
export const positiveNumToCurrencyFormat = (num: number) =>
  num > 0 ? toCurrencyFormat(num) : null;

const timeoutMs = 1500;

export const betLabel = "Bet";
export const winningsLabel = "Winnings";

type BetOrWinningsSectionProps = {
  amount: number;
  currencyColor?: string;
  label: "Bet" | "Winnings";
  seatNumber: number;
};
/**
 * Given props, returns a bet or winnings section for a player.
 *
 * @param props
 * @param props.amount the amount of money the player has bet or won
 * @param props.currencyColor optional color of the displayed amount
 * @param props.seatNubmer the number of the seat the player is sitting in
 * @param props.label the label of the section--either `"Bet"` or `"Winnings"`
 * @returns a bet or winnings section for a player
 */
const BetOrWinningsSection: FC<BetOrWinningsSectionProps> = ({
  seatNumber,
  label,
  amount,
  currencyColor,
}) => {
  const labelId = `player-bet-or-winnings-${seatNumber}`;
  const isWinnings = label === "Winnings";
  const section = (
    <Box component="section" aria-labelledby={labelId} width={1}>
      <Typography
        component="h3"
        textAlign="right"
        variant="caption"
        id={labelId}
      >
        {label}
      </Typography>
      <Typography
        color={currencyColor}
        noWrap
        variant="body1"
        fontWeight={isWinnings ? "bold" : undefined}
        textAlign="right"
      >
        {positiveNumToCurrencyFormat(amount) || <>&nbsp;</>}
      </Typography>
    </Box>
  );
  return isWinnings ? (
    <Fade in timeout={timeoutMs}>
      {section}
    </Fade>
  ) : (
    section
  );
};

export default BetOrWinningsSection;
