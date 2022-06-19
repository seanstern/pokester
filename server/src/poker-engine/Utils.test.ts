import {
  onlyDealerSeated,
  smallBlindAmongSeatedPlayers,
  dealerAtTurn,
  dealerAmongSeatedPlayers,
  dealerAfterFirstRound,
} from "../__fixtures__/poker-engine/Player.fixture";
import { canDealCards } from "./Utils";

describe("canDealCards", () => {
  describe("returns false", () => {
    test("when only one player", () => {
      expect(canDealCards(onlyDealerSeated.create())).toBe(false);
    });

    test("when player isn't dealer", () => {
      expect(canDealCards(smallBlindAmongSeatedPlayers.create())).toBe(false);
    });

    test("when round is active", () => {
      expect(canDealCards(dealerAtTurn.create())).toBe(false);
    });
  });

  describe("returns true", () => {
    test("when dealer at table with players pre-game", () => {
      expect(canDealCards(dealerAmongSeatedPlayers.create())).toBe(true);
    });

    test("when dealer at table with players between rounds", () => {
      expect(canDealCards(dealerAfterFirstRound.create())).toBe(true);
    });
  });
});
