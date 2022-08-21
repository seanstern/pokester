import {
  asJestCasesTable,
  Card as CardFixtures,
} from "@pokester/poker-engine-fixtures";
import viewOfCard from "./ViewOfCard";

const cardCases = asJestCasesTable(CardFixtures);

describe("viewOfCard produces valid JSON when given Card", () => {
  test.each(cardCases)("$description", ({ create }) => {
    expect(viewOfCard(create())).toMatchSnapshot();
  });
});
