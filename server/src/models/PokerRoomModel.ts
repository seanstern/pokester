import { Table } from "@chevtek/poker-engine";
import { Schema, model, Model, HydratedDocument } from "mongoose";
import { deserialize, serialize } from "../serializers/TableSerializer";
import { WithkReadonlyProps } from "./TypeUtils";

/**
 * The document stored in MongoDB
 *
 * Named private because properties that need to be mutated ONLY within
 * this file (via setters and methods) will be be marked as readonly
 * within public interface exposed to clients.
 */
interface PrivatePokerRoomDoc {
  /** The name of the room */
  name: string;
  /** The id of the user who created the room */
  readonly creatorId: string;
  /**
   * JSON representation of a Table.
   *
   * To be marked as readonly within the public interface exposed to
   * clients.
   */
  serializedTable: any;
  /**
   * The ids of players in the room.
   *
   * Represented outside the table in order to enable indexing.
   * readonly because the field is only mutated via replacement of
   * the array in the tableSetter
   *
   * To be marked as readonly within the public interfacce exposed
   * to clients.
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
 * Should only be called by the setTable method below because the typeof
 * serializedTable in PokerRoomDoc is any (i.e. its read/getter type) which
 * would lead to type conflicts on set. Conflict between setter v getter types
 * (Table v any) resolved by marking serlializedTable readonly and exposing
 * getTable and setTable methods in Model that is exposed to client.
 *
 * @param this a hydrated PokerRoomDoc
 * @param t a Table
 * @returns a serialized version of the Table
 */
const setSerializedTable = function (
  this: HydratedDocument<PrivatePokerRoomDoc>,
  t: Table
) {
  /**
   * Runtime check to ensure callers who try use the setter for serializedTable
   * can only use Table. Necessary because the typeof serializedTable in
   * PokerRoomDoc is any (i.e. it's read/getter type).
   */
  if (!(t instanceof Table)) {
    throw new Error("Cannot set serializedTable with value that is not Table");
  }
  const playerIds = t.players.filter((p) => p !== null).map((p) => p!.id);
  this.playerIds = playerIds;
  return serialize(t);
};

const methods = {
  /**
   * Returns the Table represented by the this.serializedTable
   * of the caller.
   *
   * Note: Mutating the this.serializedTable representation in
   * the db requires calling the setTable method below
   *
   * @param this a hydrated PokerRoomDoc
   * @returns the Table represented by the this.serializedTable
   */
  getTable: function (this: HydratedDocument<PrivatePokerRoomDoc>) {
    return deserialize(this.serializedTable);
  },
  /**
   * Given a Table, updates the this.serializedTable and this.playerIds
   * of the caller to align to the given Table
   * @param this a hydrated PokerRoomDoc
   * @returns void
   */
  setTable: function (this: HydratedDocument<PrivatePokerRoomDoc>, t: Table) {
    this.serializedTable = t;
  },
};

type PokerRoomMethods = typeof methods;

type PrivatePokerRoomModel = Model<PrivatePokerRoomDoc, {}, PokerRoomMethods>;

const PokerRoomSchema = new Schema<
  PrivatePokerRoomDoc,
  PrivatePokerRoomModel,
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

/**
 * Clients should not attempt to mutate the fields listed below
 * directly and should instead rely on methods provided via
 * PokerRoomMethods.
 */
type PokerRoomDoc = WithkReadonlyProps<
  PrivatePokerRoomDoc,
  "creatorId" | "serializedTable" | "playerIds"
>;
type PokerRoomModel = Model<PokerRoomDoc, {}, PokerRoomMethods>;

export const PokerRoomModel = model<PokerRoomDoc, PokerRoomModel>(
  "PokerRoom",
  PokerRoomSchema
);
