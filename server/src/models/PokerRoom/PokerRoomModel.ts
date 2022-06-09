import { model, Schema } from "mongoose";
import PokerRoomSchema, { PokerRoomDoc } from "./PokerRoomSchema";

const PokerRoomModel = model(
  "PokerRoom",
  PokerRoomSchema as unknown as Schema<PokerRoomDoc>
);

export default PokerRoomModel;
