import { Table } from "@chevtek/poker-engine";
import { deserialize, serialize } from "../serializers/TableSerializer";
import { Schema, model, Model, HydratedDocument } from "mongoose";

/**
 * The document stored in MongoDB
 */
interface PokerRoomDoc {
  /** The name of the room */
  name: string;
  /** The id of the user who created the room */
  creatorId: string;
  /** JSON representation of a Table */
  serializedTable: any;
  /**
   * The ids of players in the room. Represented outside the table
   * in order to enable indexing. readonly because the field is
   * only mutated via replacement of the array in the tableSetter
   */
  playerIds: readonly string[];
}

/**
 * Given a Table,
 *  - updates the this.playerIds of the caller to be the players
 *    at the Table
 *  - marks the this.serializedTable as modified and
 *  - returns a serialized verion of the Table.
 * Intended to be used as a setter for serializedTable
 * (c.f. https://mongoosejs.com/docs/tutorials/getters-setters.html#setters)
 *
 * Should only be called by the setTable method below. Avoiding setters
 * for external callers helps avoid situations where callers mutate the
 * serializedTable field directly.
 *
 * @param this a hydrated PokerRoomDoc
 * @param t a Table
 * @returns a serialized version of the Table
 */
const setSerializedTable = function (
  this: HydratedDocument<PokerRoomDoc>,
  t: Table
) {
  const playerIds = t.players.filter((p) => p !== null).map((p) => p!.id);
  this.playerIds = playerIds;
  return serialize(t);
};

const methods = {
  /**
   * Returns the Table represented by the this.serializedTable
   * of the caller
   * @param this a hydrated PokerRoomDoc
   * @returns the Table represented by the this.serializedTable
   */
  getTable: function (this: HydratedDocument<PokerRoomDoc>) {
    return deserialize(this.serializedTable);
  },
  /**
   * Given a Table, updates the this.serializedTable and this.playerIds
   * of the caller to align to the given Table
   * @param this a hydrated PokerRoomDoc
   * @returns void
   */
  setTable: function (this: HydratedDocument<PokerRoomDoc>, t: Table) {
    this.serializedTable = t;
  },
};

type PokerRoomMethods = typeof methods;
type PokerRoomModel = Model<PokerRoomDoc, {}, PokerRoomMethods>;
const PokerRoomSchema = new Schema<
  PokerRoomDoc,
  PokerRoomModel,
  PokerRoomMethods
>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    playerIds: {
      type: [String],
      required: true,
      index: true,
    },
    creatorId: {
      type: String,
      required: true,
      immutable: true,
    },
    serializedTable: {
      type: Schema.Types.Mixed,
      required: true,
      set: setSerializedTable,
    },
  },
  {
    optimisticConcurrency: true,
    timestamps: true,
  }
);
PokerRoomSchema.method(methods);

type ReadonlyPokerRoomDoc = Readonly<PokerRoomDoc>;
type ReadonlyPokerRoomModel = Model<ReadonlyPokerRoomDoc, {}, PokerRoomMethods>;
const PokerRoomModel = model<ReadonlyPokerRoomDoc, ReadonlyPokerRoomModel>(
  "PokerRoom",
  PokerRoomSchema
);
