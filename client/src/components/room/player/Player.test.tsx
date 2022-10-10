import { PokerRooms } from "@pokester/common-api";
import { render, screen, within } from "@testing-library/react";
import Player, {
  hasWinnings,
  betRegionLabel,
  displayCardsAndAmount,
  positiveNumToCurrencyFormat,
  bigBlindChipText,
  BlindPosition,
  cardsRegionLabel,
  dealerChipText,
  holeCardsToStrings,
  positionsRegionLabel,
  smallBlindChipText,
  stackRegionLabel,
  stackToCurrencyFormat,
  toToolTipText,
  winningsRegionLabel,
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
      props: { ...props, blindPosition: BlindPosition.BIG },
    },
    {
      description: `${description}, big blind`,
      props: { ...props, blindPosition: BlindPosition.SMALL },
    },
    {
      description: `${description}, no blind position`,
      props: { ...props, blindPosition: undefined },
    },
  ])
  .flatMap(({ description, props }) => [
    {
      description: `${description}, winnings present`,
      props: { ...props, winnings: 8675309.12 },
    },
    {
      description: `${description}, winnings absent`,
      props: { ...props, winnings: undefined },
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
  const isWinner = hasWinnings(playerProps.winnings);

  render(<Player {...playerProps} seatNumber={seatNumber} />);

  const playerRegion = screen.getByRole("region", {
    name: playerProps.id,
    description:
      toToolTipText(
        playerProps.left,
        playerProps.folded,
        playerProps.isCurrentActor,
        isWinner
      ) || undefined,
  });

  within(playerRegion).getByRole("heading", { level: 2, name: playerProps.id });

  const positionRegion = within(playerRegion).getByRole("region", {
    name: positionsRegionLabel,
  });

  expect(within(positionRegion).queryByText(dealerChipText)).toEqual(
    playerProps.isDealer ? expect.anything() : null
  );
  expect(within(positionRegion).queryByText(smallBlindChipText)).toEqual(
    playerProps.blindPosition === BlindPosition.SMALL ? expect.anything() : null
  );
  expect(within(positionRegion).queryByText(bigBlindChipText)).toEqual(
    playerProps.blindPosition === BlindPosition.BIG ? expect.anything() : null
  );

  const stackRegion = within(playerRegion).getByRole("region", {
    name: stackRegionLabel,
  });
  within(stackRegion).getByText(stackToCurrencyFormat(playerProps.stackSize));

  const hasCardsAndAmount = displayCardsAndAmount(
    playerProps.isRoundInProgress,
    isWinner
  );

  const cardsRegion = within(playerRegion).queryByRole("region", {
    name: cardsRegionLabel,
  });
  expect(cardsRegion).toEqual(hasCardsAndAmount ? expect.anything() : null);
  if (cardsRegion) {
    within(cardsRegion).getByRole("heading", {
      level: 3,
      name: cardsRegionLabel,
    });
    holeCardsToStrings(
      playerProps.holeCards,
      playerProps.isRoundInProgress,
      isWinner,
      playerProps.folded
    ).forEach((hcText) => {
      if (hcText) within(cardsRegion).getAllByText(hcText);
    });
  }

  const amountRegion = within(playerRegion).queryByRole("region", {
    name: isWinner ? winningsRegionLabel : betRegionLabel,
  });
  expect(amountRegion).toEqual(hasCardsAndAmount ? expect.anything() : null);
  const amountInCurrencyFormat = positiveNumToCurrencyFormat(
    isWinner ? playerProps.winnings! : playerProps.bet
  );
  if (amountRegion && amountInCurrencyFormat)
    within(amountRegion).getByText(amountInCurrencyFormat);
});
