import { render, screen, within } from "@testing-library/react";
import PositionsSection, {
  bigBlindChipText,
  BlindPosition,
  dealerChipText,
  getChipText,
  label,
  smallBlindChipText,
} from "./PositionsSection";

const cases = [
  { description: "not dealer", props: { dealer: false } },
  { description: "dealer", props: { dealer: true } },
].flatMap(({ description, props }) => [
  {
    description: `${description}, no blind positon`,
    props: { ...props, blindPosition: undefined },
  },
  {
    description: `${description}, small blind`,
    props: { ...props, blindPosition: BlindPosition.SMALL },
  },
  {
    description: `${description}, big blind`,
    props: { ...props, blindPosition: BlindPosition.BIG },
  },
]);

test.each(cases)(`renders positions section when $description`, ({ props }) => {
  render(<PositionsSection {...props} />);

  const positionsRegion = screen.getByRole("region", { name: label });

  const displayedChipText = getChipText(props.dealer, props.blindPosition);

  const possibleChipTexts = [
    dealerChipText,
    smallBlindChipText,
    bigBlindChipText,
  ];
  possibleChipTexts.forEach((ct) =>
    expect(within(positionsRegion).queryByText(ct)).toEqual(
      ct === displayedChipText ? expect.anything() : null
    )
  );
});
