import { Pot as PokerEnginePot } from "@chevtek/poker-engine";
import Player from "./Player";

type Pot = Pick<PokerEnginePot, "amount"> & {
  eligiblePlayers: Player[];
  winners?: Player[];
};

export default Pot;
