import { Player } from "@chevtek/poker-engine";
import { Fixture } from "../TypeUtils";
import {
  onePlayerSeated,
  playersSeated,
  preFlop,
  completeRound,
  flop,
  turn,
} from "./Table.fixture";

export const onlyDealerSeated: Fixture<Player> = {
  description: "Dealer seated alone at table, pre-game",
  create: () => {
    const player = onePlayerSeated.create().dealer;
    if (!player) {
      throw new Error("No dealer in onePlayerSeated Table.fixture");
    }
    return player;
  },
};

export const dealerAmongSeatedPlayers: Fixture<Player> = {
  description: "Dealer seated at table with players, pre-game",
  create: () => {
    const player = playersSeated.create().dealer;
    if (!player) {
      throw new Error("No dealer in playersSeated Table.fixture");
    }
    return player;
  },
};

export const smallBlindAmongSeatedPlayers: Fixture<Player> = {
  description: "Small blind player seated at table with players, pre-game",
  create: () => {
    const player = playersSeated.create().smallBlindPlayer;
    if (!player) {
      throw new Error("No smallBlindPlayer in playersSeated Table.fixture");
    }
    return player;
  },
};

export const dealerAtFlop: Fixture<Player> = {
  description: "Dealer at flop",
  create: () => {
    const player = flop.create().dealer;
    if (!player) {
      throw new Error("No dealer in playersSeated Table.fixture");
    }
    return player;
  },
};

export const priorActorPostDealPreFlop: Fixture<Player> = {
  description:
    "Player immediately priort to current actor, immeidately after cards dealt",
  create: () => {
    const { lastActor } = preFlop.create();
    if (!lastActor) {
      throw new Error("No lastActor in preFlop Table.fixture");
    }
    return lastActor;
  },
};

export const currentActorPostDealPreFlop: Fixture<Player> = {
  description: "Player who is current actor, immediately after cards dealt",
  create: () => {
    const { currentActor } = preFlop.create();
    if (!currentActor) {
      throw new Error("No currentActor in preFlop Table.fixture");
    }
    return currentActor;
  },
};

export const folded: Fixture<Player> = {
  description:
    "Player who has folded during flop, immediately at start of turn",
  create: () => {
    const { players } = turn.create();
    const foldedPlayer = players.find((player) => player?.folded === true);
    if (!foldedPlayer) {
      throw new Error("No foldedPlayer in turn Table.fixture");
    }
    return foldedPlayer;
  },
};

export const dealerStoodUpAtEndOfRound: Fixture<Player> = {
  description: "Dealer who has stood up, immediately after completion of round",
  create: () => {
    const { dealer } = completeRound.create();
    if (!dealer) {
      throw new Error("No dealer in completeRound Table.fixture");
    }
    if (!dealer.left) {
      throw new Error("Dealer has not stood up in completeRound Table.fixtre");
    }
    return dealer;
  },
};

export const nonDealerPlayerWithStoodUpDealerAtEndOfRound: Fixture<Player> = {
  description:
    "Non dealer at table with dealer who stood up, immediately after completion of round",
  create: () => {
    const table = completeRound.create();
    const nonDealer = table.players.find(
      (p) => p?.left === false && table.dealer !== p
    );
    if (!nonDealer) {
      throw new Error("No non dealer in completeRound Table.fixture");
    }
    return nonDealer;
  },
};

export const winner: Fixture<Player> = {
  description: "Player who is winner, immediately after completion of round",
  create: () => {
    const { winners } = completeRound.create();
    if (!winners) {
      throw new Error("No winners array in completeRound Table.fixture");
    }
    if (winners.length < 1) {
      throw new Error(
        "No elements in winners array in completeRound Table.fixture"
      );
    }
    return winners[0];
  },
};
