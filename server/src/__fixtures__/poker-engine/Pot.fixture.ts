import { Pot } from "@chevtek/poker-engine";
import { Fixture } from "../TypeUtils";
import { preFlop, flop, completeRound } from "./Table.fixture";

/**
 * Given a potentially empty array of Pots, returns a Pot when the array
 * contains exactly one Pot; throws an error otherwise.
 * @param pots
 */
const getPot = (pots: Pot[]): Pot => {
  if (!pots) {
    throw new Error("No pots array in preFlop Table.fixture");
  }
  if (pots.length < 1) {
    throw new Error("No elements in pots array in preFlop Table.fixture");
  }
  return pots[0];
};

export const emptyPot: Fixture<Pot> = {
  description: "empty Pot",
  create: () => getPot(preFlop.create().pots),
};

export const potWithEligiblePlayersNoWinners: Fixture<Pot> = {
  description: "Pot with eligible players, no winners",
  create: () => {
    const pot = getPot(flop.create().pots);
    if (pot.eligiblePlayers.length < 1) {
      throw new Error(
        "No elements in eligiblePlayers array in flop Table.fixture"
      );
    }
    return pot;
  },
};

type WinnersPot = Pot & Required<Pick<Pot, "winners">>;
export const potWithWinners: Fixture<WinnersPot> = {
  description: "Pot with eligible players and winners",
  create: () => {
    const pot = getPot(completeRound.create().pots);
    if (!pot.winners) {
      throw new Error("No winners array in completeRound Table.fixture");
    }
    if (pot.winners.length < 1) {
      throw new Error(
        "No elements in winners array in completeRound Table.fixture"
      );
    }
    return pot as WinnersPot;
  },
};
