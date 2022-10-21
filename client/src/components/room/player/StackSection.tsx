import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FC } from "react";
import toCurrencyFormat from "../toCurrencyFormat";

/**
 * Given a numerical amount, returns a string representation of the amount.
 *
 * @param amt an amount
 * @returns a string representation of the amount
 */
export const amountToCurrencyFormat = toCurrencyFormat;

export const label = "Stack";

type StackSectionProps = {
  amount: number;
  currencyColor?: string;
};
const StackSection: FC<StackSectionProps> = ({ amount, currencyColor }) => (
  <Box component="section" aria-label={label} width={1}>
    <Typography variant="body1" noWrap color={currencyColor} textAlign="right">
      {amountToCurrencyFormat(amount)}
    </Typography>
  </Box>
);

export default StackSection;
