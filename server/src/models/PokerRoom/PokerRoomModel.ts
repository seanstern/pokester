import { model } from "mongoose";
import PokerRoomSchema, {
  PublicPokerRoomDoc as PokerRoomDoc,
  PublicPokerRoomModel as PokerRoomModel,
} from "./PokerRoomSchema";

const PokerRoom = model<PokerRoomDoc, PokerRoomModel>(
  "PokerRoom",
  PokerRoomSchema as any
);

export default PokerRoom;
