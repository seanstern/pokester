import Typography from "@mui/material/Typography";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";
import toCurrencyFormat from "../toCurrencyFormat";
import useCurrencyColor from "../useCurrencyColor";
import Box from "@mui/material/Box";

export const potsRegionLabel = "Pot";
const sidePotsLabelId = "side-pots-id";
export const sidePotsRegionLabel = "Side Pot(s)";

export type PotsProps = {
  pots: PokerRooms.Get.Pot[];
};
/**
 * Given props, returns the pots at the table.
 *
 * @param props
 * @param props.pots the pots
 * @returns pots at the table
 */
const Pots: FC<PotsProps> = ({ pots }) => {
  const currencyColor = useCurrencyColor();
  const [mainPot, ...sidePots] = [...pots].reverse();
  const hasSidePots = sidePots.length > 0;
  const hasAnyWinners = pots.find(
    ({ winners }) => winners && winners.length > 0
  );
  const potColor = hasAnyWinners ? "text.disabled" : currencyColor;
  return (
    <Box
      component="section"
      textAlign="center"
      minHeight={68}
      aria-label={potsRegionLabel}
    >
      {!hasSidePots && (
        <Typography component="h2" variant="caption">
          {potsRegionLabel}
        </Typography>
      )}
      <Typography
        component={!hasSidePots ? "p" : "h2"}
        variant={!hasSidePots ? "h5" : "body1"}
        color={potColor}
      >
        {toCurrencyFormat(mainPot.amount)}
      </Typography>
      {hasSidePots && (
        <Box component="section" aria-labelledby={sidePotsLabelId}>
          <Typography variant="caption" component="h3" id={sidePotsLabelId}>
            {sidePotsRegionLabel}
          </Typography>
          <Typography component="p" variant="body2" noWrap color={potColor}>
            {sidePots.map((sp) => toCurrencyFormat(sp.amount)).join(", ") || (
              <>&nbsp;</>
            )}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Pots;
