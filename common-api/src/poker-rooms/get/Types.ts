import * as PokerEngine from "@chevtek/poker-engine";
import PlayerAction from "../PlayerAction";

export { PlayerAction };

export type Card = Pick<
  PokerEngine.Card,
  "rank" | "suit" | "color" | "suitChar"
>;

type CommonPlayer = Pick<
  PokerEngine.Player,
  "bet" | "folded" | "left" | "id" | "stackSize"
> & {
  holeCards?: [Card, Card];
  handDescr?: string;
};

export type SelfPlayer = CommonPlayer & {
  isSelf: true;
  legalActions?: PlayerAction[];
};

export type OpponentPlayer = CommonPlayer & {
  isSelf: false;
};

export type Player = SelfPlayer | OpponentPlayer;

export type Pot = Pick<PokerEngine.Pot, "amount"> & {
  eligiblePlayers: Player[];
  winners?: Player[];
};

export type Table = Pick<
  PokerEngine.Table,
  | "bigBlindPosition"
  | "currentBet"
  | "currentPosition"
  | "currentRound"
  | "dealerPosition"
  | "handNumber"
  | "smallBlindPosition"
  | "buyIn"
  | "smallBlind"
  | "bigBlind"
> & {
  communityCards: Card[];
  players: (Player | null)[];
  pots: Pot[];
  winners?: Player[];
};

export type ResBody = {
  id: string;
  name: string;
  table: Table;
  canSit: boolean;
};
