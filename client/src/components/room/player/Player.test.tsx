import { PokerRooms } from "@pokester/common-api";
import { render, screen, within } from "@testing-library/react";
import Player, {
  betRegionLabel,
  betToCurrencyFormat,
  bigBlindChipText,
  BlindPosition,
  cardsRegionLabel,
  dealerChipText,
  holeCardsToText,
  positionsRegionLabel,
  smallBlindChipText,
  stackRegionLabel,
  stackToCurrencyFormat,
  toToolTipText,
} from "./Player";

const jestCasesTable = [
  { description: "non-dealer", props: { isDealer: true } },
  { description: "dealer", props: { isDealer: false } },
]
  .flatMap(({ description, props }) => [
    {
      description: `${description}, non-current-actor`,
      props: { ...props, isCurrentActor: false },
    },
    {
      description: `${description}, current-actor`,
      props: { ...props, isCurrentActor: true },
    },
  ])
  .flatMap(({ description, props }) => [
    {
      description: `${description}, non-round-in-progress`,
      props: { ...props, isRoundInProgress: false },
    },
    {
      description: `${description}, round-in-progress`,
      props: { ...props, isRoundInProgress: true },
    },
  ])
  .flatMap(({ description, props }) => [
    {
      description: `${description}, big blind`,
      props: { ...props, blindPosition: BlindPosition.Big },
    },
    {
      description: `${description}, big blind`,
      props: { ...props, blindPosition: BlindPosition.Small },
    },
    {
      description: `${description}, no blind position`,
      props: { ...props, blindPosition: undefined },
    },
  ])
  .flatMap(({ description, props }) =>
    Object.values(PokerRooms.Get.Fixtures.Player).map((fixture) => ({
      description: `${description} player based on poker-engine-fixture: "${fixture.description}"`,
      create: () => ({ ...props, ...fixture.create() }),
    }))
  );

test.each(jestCasesTable)("renders $description", ({ create }) => {
  const playerProps = create();
  const seatNumber = 0;
  render(<Player {...playerProps} seatNumber={seatNumber} />);

  const playerRegion = screen.getByRole("region", {
    name: playerProps.id,
    description:
      toToolTipText(playerProps.left, playerProps.folded, false) || undefined,
  });

  within(playerRegion).getByRole("heading", { level: 2, name: playerProps.id });

  const positionRegion = within(playerRegion).getByRole("region", {
    name: positionsRegionLabel,
  });

  expect(within(positionRegion).queryByText(dealerChipText)).toEqual(
    playerProps.isDealer ? expect.anything() : null
  );
  expect(within(positionRegion).queryByText(smallBlindChipText)).toEqual(
    playerProps.blindPosition === BlindPosition.Small ? expect.anything() : null
  );
  expect(within(positionRegion).queryByText(bigBlindChipText)).toEqual(
    playerProps.blindPosition === BlindPosition.Big ? expect.anything() : null
  );

  const stackRegion = within(playerRegion).getByRole("region", {
    name: stackRegionLabel,
  });
  within(stackRegion).getByText(stackToCurrencyFormat(playerProps.stackSize));

  const cardsRegion = within(playerRegion).getByRole("region", {
    name: cardsRegionLabel,
  });
  within(cardsRegion).getByRole("heading", {
    level: 3,
    name: cardsRegionLabel,
  });
  holeCardsToText(
    playerProps.holeCards,
    playerProps.isRoundInProgress,
    playerProps.folded
  ).forEach((hcText) => {
    if (hcText) within(cardsRegion).getAllByText(hcText);
  });

  const betRegion = within(playerRegion).getByRole("region", {
    name: betRegionLabel,
  });
  const betInCurrencyFormat = betToCurrencyFormat(playerProps.bet);
  if (betInCurrencyFormat) within(betRegion).getByText(betInCurrencyFormat);
});
