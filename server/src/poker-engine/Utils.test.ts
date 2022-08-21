import {
  dealerAmongSeatedPlayers,
  dealerAtFlop,
  dealerStoodUpAtEndOfRound,
  nonDealerPlayerWithStoodUpDealerAtEndOfRound,
  onlyDealerSeated,
  smallBlindAmongSeatedPlayers,
} from "@pokester/poker-engine-fixtures/Player";
import { canDealCards } from "./Utils";

describe("canDealCards", () => {
  describe("returns false", () => {
    test("when player is dealer but only one player", () => {
      expect(canDealCards(onlyDealerSeated.create())).toBe(false);
    });

    test("when player isn't dealer and dealer hasn't left", () => {
      expect(canDealCards(smallBlindAmongSeatedPlayers.create())).toBe(false);
    });

    test("when player is dealer and round is active", () => {
      expect(canDealCards(dealerAtFlop.create())).toBe(false);
    });

    test("when player is dealer but has stood up", () => {
      expect(canDealCards(dealerStoodUpAtEndOfRound.create())).toBe(false);
    });
  });

  describe("returns true", () => {
    test("when player is dealer at table with players pre-game", () => {
      expect(canDealCards(dealerAmongSeatedPlayers.create())).toBe(true);
    });

    test("when player is non-dealer at end of round and dealer has already stood up", () => {
      expect(
        canDealCards(nonDealerPlayerWithStoodUpDealerAtEndOfRound.create())
      ).toBe(true);
    });
  });
});
