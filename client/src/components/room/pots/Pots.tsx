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
  const [mainPot, ...sidePots] =
    pots.length > 0
      ? [...pots].reverse()
      : [{ amount: 0, eligiblePlayers: [] }];
  const hasSidePots = sidePots.length > 0;
  const hasAnyWinners = pots.find(
    ({ winners }) => winners && winners.length > 0
  );
  const potColor = hasAnyWinners ? "text.disabled" : currencyColor;
  const mainPotTypographyProps = hasSidePots
    ? {
        component: "h2" as "h2",
        variant: "body1" as "body1",
        fontWeight: "bold" as "bold",
      }
    : { component: "p" as "p", variant: "h6" as "h6" };
  return (
    <Box
      component="section"
      minHeight={64}
      textAlign="center"
      aria-label={potsRegionLabel}
    >
      {!hasSidePots && (
        <Typography component="h2" variant="caption">
          {potsRegionLabel}
        </Typography>
      )}
      <Typography color={potColor} {...mainPotTypographyProps}>
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
