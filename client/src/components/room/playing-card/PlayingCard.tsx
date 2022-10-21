import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import { PokerRooms } from "@pokester/common-api";
import { FC, MutableRefObject, useEffect, useState } from "react";
import emojify from "react-easy-emoji";
import { getRenderColor, getSuitCharImg } from "../../card-utils";

const hiddenCardEmoji = "🃏";
export const hiddenCardLabel = "Hidden Card";

const dealTimeoutMs = 500;
const dealDirection = "up";

type HiddenPlayingCardProps = {
  containerRef?: MutableRefObject<null>;
};
/**
 * Given props, returns a playing card whose rank and suit are hidden.
 *
 * @param props
 * @param props.containerRef a reference for the container the card is in;
 *   useful for transition effects required internaly; for more info see
 *   {@link https://mui.com/material-ui/api/slide}
 * @returns a playing card whose rank and suit are hidden
 */
const HiddenPlayingCard: FC<HiddenPlayingCardProps> = ({ containerRef }) => {
  return (
    <Slide
      in
      direction={dealDirection}
      container={containerRef?.current}
      timeout={dealTimeoutMs}
    >
      <Box fontSize={24} my={-0.5} aria-label={hiddenCardLabel}>
        {emojify(hiddenCardEmoji)}
      </Box>
    </Slide>
  );
};

/**
 * Given a visible card, returns the label used for it.
 *
 * @param visible a card
 * @returns the label for the card
 */
export const getVisibleCardLabel = (visible: PokerRooms.Get.Card) =>
  `${visible.rank}${visible.suitChar}`;

const showTimeoutMs = 750;
const showDirection = "right";

type Size = "short" | "tall";
type VisiblePlayingCardProps = {
  containerRef?: MutableRefObject<null>;
  dealt?: boolean;
  size?: Size;
  visible: PokerRooms.Get.Card;
};
/**
 * Given props, returns a visible playing card--that is, a playing card whose
 * rank and suit are shown.
 *
 * @param props
 * @param props.containerRef a reference for the container the card is in;
 *   useful for transition effects required internaly; for more info see
 *   {@link https://mui.com/material-ui/api/slide}
 * @param props.dealt an optional boolean indicating whether or not the card
 *   being displayed comes from the dealer (displayed cards can come from the
 *   dealer OR be the result of showing cards at the end of a round)
 * @param props.size optional indication of the height of the card, either
 *   `"short"` or `"tall"`; by default `"short"`
 * @param props.visible a card whose rank and suit are visible
 * @returns a visible playign card--that is, a playing card whose rank and suit
 *   are shown
 */
const VisiblePlayingCard: FC<VisiblePlayingCardProps> = ({
  visible,
  size,
  containerRef,
  dealt,
}) => {
  const [transitionIn, setTransitionIn] = useState(false);
  useEffect(() => {
    setTransitionIn(false);
    setTimeout(() => setTransitionIn(true), 1);
  }, [setTransitionIn, visible.rank, visible.suitChar]);

  return (
    <Slide
      in={transitionIn}
      direction={dealt ? dealDirection : showDirection}
      container={containerRef?.current}
      timeout={
        dealt
          ? { appear: dealTimeoutMs, enter: dealTimeoutMs, exit: 0 }
          : { appear: showTimeoutMs, enter: showTimeoutMs, exit: 0 }
      }
    >
      <Paper
        sx={{
          m: 0.2,
          px: 0.25,
          bgcolor: "white",
          py: size === "tall" ? 0.2 : undefined,
          display: "flex",
          flexWrap: "nowrap",
          minWidth: "auto",
          alignItems: "center",
        }}
        aria-label={`${visible.rank}${visible.suitChar}`}
      >
        <Typography
          color={getRenderColor(visible.color)}
          component="span"
          variant="body1"
        >
          {visible.rank}
        </Typography>
        <Typography component="span" variant="caption" mx={-0.2}>
          {getSuitCharImg(visible.suitChar)}
        </Typography>
      </Paper>
    </Slide>
  );
};

export type PlayingCardProps = {
  containerRef?: MutableRefObject<null>;
  dealt?: boolean;
  size?: Size;
  visible?: PokerRooms.Get.Card | null;
};
/**
 * Given props, returns a playing card.
 *
 * @param props
 * @param props.containerRef a reference for the container the card is in;
 *   useful for transition effects required internaly; for more info see
 *   {@link https://mui.com/material-ui/api/slide}
 * @param props.dealt an optional boolean indicating whether or not the card
 *   being displayed comes from the dealer (displayed cards can come from the
 *   dealer OR be the result of showing cards at the end of a round)
 * @param props.size optional indication of the height of the card, either
 *   `"short"` or `"tall"`; by default `"short"`
 * @param props.visible an optional card whose rank and suit are visible; when
 *  null or undefined, a card whose rank and suit are hidden is shown
 * @return a playing card
 */
const PlayingCard: FC<PlayingCardProps> = ({
  containerRef,
  dealt,
  size,
  visible,
}) =>
  visible ? (
    <VisiblePlayingCard
      containerRef={containerRef}
      dealt={dealt}
      size={size}
      visible={visible}
    />
  ) : (
    <HiddenPlayingCard containerRef={containerRef} />
  );
export default PlayingCard;
