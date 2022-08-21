import {
  dealerAmongSeatedPlayers,
  currentActorPostDealPreFlop,
  priorActorPostDealPreFlop,
  folded,
  winner,
} from "@pokester/poker-engine-fixtures/Player";
import { Routes } from "@pokester/common-api";
import viewOfPlayer from "./ViewOfPlayer";

describe("viewOfPlayer produces vaild JSON when given a Player", () => {
  describe("that represents the viewer", () => {
    describe("with holeCards present", () => {
      test("with playing legal actions present", () => {
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
            "handDescr": "5 High",
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
              "stand",
              "call",
              "raise",
              "fold",
            ],
            "stackSize": 9199,
          }
        `);
      });

      test("with playing legal actions absent", () => {
        const player = priorActorPostDealPreFlop.create();
        const { id: viewerId } = player;
        const view = viewOfPlayer(viewerId, player);
        expect(view).toMatchObject({
          isSelf: true,
          holeCards: expect.any(Array),
          legalActions: expect.any(Array),
        });
        expect(view).toMatchInlineSnapshot(`
          Object {
            "bet": 10,
            "folded": false,
            "handDescr": "3 High",
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
            "legalActions": Array [
              "stand",
            ],
            "stackSize": 2990,
          }
        `);
      });
    });

    describe("with holeCards absent", () => {
      test("with playing legal actions present", () => {
        const player = dealerAmongSeatedPlayers.create();
        const { id: viewerId } = player;
        const view = viewOfPlayer(viewerId, player);
        expect(view).toMatchObject({
          isSelf: true,
          legalActions: expect.any(Array),
        });
        expect(view.holeCards).toBeUndefined();
        expect(view).toMatchInlineSnapshot(`
          Object {
            "bet": 0,
            "folded": false,
            "handDescr": undefined,
            "holeCards": undefined,
            "id": "John",
            "isSelf": true,
            "left": false,
            "legalActions": Array [
              "stand",
              "deal",
            ],
            "stackSize": 2000,
          }
        `);
      });

      test("with playing legal actions absent", () => {
        const player = folded.create();
        const { id: viewerId } = player;
        const view = viewOfPlayer(viewerId, player);
        expect(view).toMatchObject({
          isSelf: true,
          legalActions: expect.any(Array),
        });
        expect(view.holeCards).toBeUndefined();
        expect(view).toMatchInlineSnapshot(`
          Object {
            "bet": 0,
            "folded": true,
            "handDescr": undefined,
            "holeCards": undefined,
            "id": "Jane",
            "isSelf": true,
            "left": false,
            "legalActions": Array [
              "stand",
            ],
            "stackSize": 2990,
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
          "handDescr": "Royal Flush",
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
          "isSelf": false,
          "left": false,
          "legalActions": undefined,
          "stackSize": 9209,
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
          "handDescr": undefined,
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
