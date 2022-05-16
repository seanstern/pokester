import { Table as PokerEngineTable } from "@chevtek/poker-engine";
import Card from "./Card";
import { Player } from "./Player";
import Pot from "./Pot";

type Table = Pick<
  PokerEngineTable,
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

export default Table;
