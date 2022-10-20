import { shuffledDeck, getRenderColor, getSuitCharImg } from "../../card-utils";
import { FC, useState } from "react";
import Slide from "@mui/material/Slide";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const randomCards = () => shuffledDeck().slice(-5);
const defaultCardTransitionTimeMs = 500;

/**
 * Given props, returns animated cards.
 */
type CardsAnimationProps = {
  in?: boolean | undefined;
  cardTransitionTimeMs?: number | undefined;
};
/**
 * Given props, returns animated cards.
 *
 * @param param
 * @param param.in boolean indicating that the animation should begin.
 * @param param.cardTransitionTimeMs amount of time for a card to transition
 *   in the animation
 * @returns animated cards
 */
const CardsAnimation: FC<CardsAnimationProps> = ({
  in: inProp,
  cardTransitionTimeMs: cardTransitionTimeMsProp,
}) => {
  const [cards] = useState(randomCards);
  const cardTransitionTimeMs =
    cardTransitionTimeMsProp ?? defaultCardTransitionTimeMs;
  return (
    <>
      {cards.map((card, idx) => (
        <Slide
          key={idx}
          appear
          direction={"down"}
          in={inProp}
          style={{
            transitionDelay: `${(idx + 1) * cardTransitionTimeMs}ms`,
          }}
          timeout={cardTransitionTimeMs * (1 + idx / cards.length)}
        >
          <Paper
            elevation={4}
            sx={{
              bgcolor: "white",
              ml: -idx * 0.25,
              px: 2 / 3,
              py: 5 / 3,
              zIndex: idx + 1,
              display: "flex",
              flexWrap: "nowrap",
              minWidth: "auto",
              alignItems: "center",
            }}
            aria-label={`${card.rank}${card.suitChar}`}
          >
            <Typography
              color={getRenderColor(card.color)}
              component="span"
              variant="h4"
            >
              {card.rank}
            </Typography>
            <Typography ml={-0.25} component="span" variant="h5">
              {getSuitCharImg(card.suitChar)}
            </Typography>
          </Paper>
        </Slide>
      ))}
    </>
  );
};

export default CardsAnimation;
