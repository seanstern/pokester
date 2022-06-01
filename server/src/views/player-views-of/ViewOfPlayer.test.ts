import {
  playerSeated,
  currentActorPostDealPreFlop,
  priorActorPostDealPreFlop,
  winner,
} from "../../__fixtures__/poker-engine/Player.fixture";
import { Routes } from "common-api";
import viewOfPlayer from "./ViewOfPlayer";

describe("viewOfPlayer produces vaild JSON when given a Player", () => {
  describe("that represents the viewer", () => {
    describe("with holeCards present", () => {
      test("with legalActions present", () => {
        const player = currentActorPostDealPreFlop.create();
        const { id: viewerId } = player;
        const view = viewOfPlayer(viewerId, player);
        expect(view).toMatchObject({
          isSelf: true,
          holeCards: expect.any(Array),
          legalActions: expect.any(Array),
        });
        expect(view).toMatchInlineSnapshot(`
          Object {
            "bet": 0,
            "folded": false,
            "holeCards": Array [
              Object {
                "color": "#000000",
                "rank": "4",
                "suit": "s",
                "suitChar": "♠",
              },
              Object {
                "color": "#000000",
                "rank": "5",
                "suit": "s",
                "suitChar": "♠",
              },
            ],
            "id": "Juan",
            "isSelf": true,
            "left": false,
            "legalActions": Array [
              "call",
              "raise",
              "fold",
            ],
            "stackSize": 9199,
          }
        `);
      });

      test("with legalActions absent", () => {
        const player = priorActorPostDealPreFlop.create();
        const { id: viewerId } = player;
        const view = viewOfPlayer(viewerId, player);
        expect(view).toMatchObject({
          isSelf: true,
          holeCards: expect.any(Array),
        });
        expect(
          (view as Routes.PokerRooms.Get.SelfPlayer).legalActions
        ).toBeUndefined();
        expect(view).toMatchInlineSnapshot(`
          Object {
            "bet": 10,
            "folded": false,
            "holeCards": Array [
              Object {
                "color": "#000000",
                "rank": "2",
                "suit": "s",
                "suitChar": "♠",
              },
              Object {
                "color": "#000000",
                "rank": "3",
                "suit": "s",
                "suitChar": "♠",
              },
            ],
            "id": "Jane",
            "isSelf": true,
            "left": false,
            "legalActions": undefined,
            "stackSize": 2990,
          }
        `);
      });
    });

    describe("with holeCards, legalActions both absent", () => {
      test("player has no holeCards", () => {
        const player = playerSeated.create();
        const { id: viewerId } = player;
        const view = viewOfPlayer(viewerId, player);
        expect(view.isSelf).toBe(true);
        expect(view.holeCards).toBeUndefined();
        expect(
          (view as Routes.PokerRooms.Get.SelfPlayer).legalActions
        ).toBeUndefined();
        expect(view).toMatchInlineSnapshot(`
          Object {
            "bet": 0,
            "folded": false,
            "holeCards": undefined,
            "id": "Jane",
            "isSelf": true,
            "left": false,
            "legalActions": undefined,
            "stackSize": 3000,
          }
        `);
      });

      test("player folded", () => {
        const player = playerSeated.create();
        const { id: viewerId } = player;
        const view = viewOfPlayer(viewerId, player);
        expect(view.isSelf).toBe(true);
        expect(view.holeCards).toBeUndefined();
        expect(
          (view as Routes.PokerRooms.Get.SelfPlayer).legalActions
        ).toBeUndefined();
        expect(view).toMatchInlineSnapshot(`
          Object {
            "bet": 0,
            "folded": false,
            "holeCards": undefined,
            "id": "Jane",
            "isSelf": true,
            "left": false,
            "legalActions": undefined,
            "stackSize": 3000,
          }
        `);
      });
    });
  });

  describe("the represents an opponent", () => {
    test("with holeCards present (because opponent is showing cards)", () => {
      const player = winner.create();
      const { id: playerId } = player;
      const notPlayerId = `diffThan${playerId}`;
      const view = viewOfPlayer(notPlayerId, player);
      expect(view).toMatchObject({
        isSelf: false,
        holeCards: expect.any(Array),
      });
      // view is not a SelfPlayer--it's an OpponentPlayer,
      // however one sub-goal of unit test is to ensure legalActions
      // is *always* undefined on OpponentPlayer
      expect(
        (view as Routes.PokerRooms.Get.SelfPlayer).legalActions
      ).toBeUndefined();
      expect(view).toMatchInlineSnapshot(`
        Object {
          "bet": 0,
          "folded": false,
          "holeCards": Array [
            Object {
              "color": "#000000",
              "rank": "2",
              "suit": "s",
              "suitChar": "♠",
            },
            Object {
              "color": "#000000",
              "rank": "3",
              "suit": "s",
              "suitChar": "♠",
            },
          ],
          "id": "Jane",
          "isSelf": false,
          "left": false,
          "legalActions": undefined,
          "stackSize": 3010,
        }
      `);
    });

    test("with holeCards absent", () => {
      const player = currentActorPostDealPreFlop.create();
      const { id: playerId } = player;
      const notPlayerId = `diffThan${playerId}`;
      const view = viewOfPlayer(notPlayerId, player);
      expect(view.isSelf).toBe(false);
      expect(view.holeCards).toBeUndefined();
      // view is not a SelfPlayer--it's an OpponentPlayer,
      // however one sub-goal of unit test is to ensure legalActions
      // is *always* undefined on OpponentPlayer
      expect(
        (view as Routes.PokerRooms.Get.SelfPlayer).legalActions
      ).toBeUndefined();
      expect(view).toMatchInlineSnapshot(`
        Object {
          "bet": 0,
          "folded": false,
          "holeCards": undefined,
          "id": "Juan",
          "isSelf": false,
          "left": false,
          "legalActions": undefined,
          "stackSize": 9199,
        }
      `);
    });
  });
});
