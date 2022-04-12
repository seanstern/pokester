import { Table } from "@chevtek/poker-engine";
import { Model, Schema } from "mongoose";
import { deserialize, serialize } from "../../serializers/TableSerializer";

/**
 * The interface for a PokerRoom document stored in MongoDB
 *
 * Intended to be private because clients should NOT have
 *   - write access to creatorId
 *   - read or write access to serializedTable; it merely
 *     supplies the information to produce a deserialzed
 *     Table instance (which clients CAN access); its value
 *     is written pre-save based on deserialized Table
 *     instance
 *   - write access to playerIds; it merely supplies index-based
 *     querying for playerIds that are otherwise inaccessible
 *     in the serializedTable instance
 *
 * See PokerRoomDoc for fields that are intended for clients
 *
 * This interface is useful for private read and writes via middleware
 * (c.f. https://mongoosejs.com/docs/middleware.html)
 */
export interface SerializedPokerRoomDoc {
  /** The name of the room */
  name: string;

  /** The id of the user who created the room */
  creatorId: string;

  /** JSON representation of a Table */
  serializedTable: any;

  /**
   * The ids of players in the room.
   *
   * Represented outside the serializedTable in order to indexed
   * based queries
   */
  playerIds: string[];
}

export type SerializedPokerRoomModel = Model<
  SerializedPokerRoomDoc,
  {},
  {},
  { table: Table }
>;
const PokerRoomSchema = new Schema<
  SerializedPokerRoomDoc,
  SerializedPokerRoomModel,
  {},
  {}
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
    },
  },
  {
    optimisticConcurrency: true,
    timestamps: true,
  }
);

/**
 * The interface for a PokerRoom document pre- and post-initialization
 * (c.f. https://mongoosejs.com/docs/api.html#document_Document-init)
 *
 * Intended to be private for all reasons specified in
 * SerializedPokerRoomDoc and because clients should not have
 *    - read or write access to deserializedTable; it merely
 *      supplies a safe read/write locaiton for virtual table
 *      getter and setter (to be defined below)
 *
 * This interface is useful for private read and writes via middleware
 * (c.f. https://mongoosejs.com/docs/middleware.html)
 */
export interface DeserializedPokerRoomDoc extends SerializedPokerRoomDoc {
  deserializedTable: Table;
}

/**
 * Given a Table, returns the ids of each of the players at the Table.
 * @param t a Table
 * @returns an array containing the ids of each of the player sat the Table.
 */
export const getPlayerIds = (t: Table) =>
  t.players.filter((p) => p !== null).map((p) => p!.id);

type VirtualTableSetterThis = Partial<
  Pick<
    DeserializedPokerRoomDoc,
    "playerIds" | "serializedTable" | "deserializedTable"
  >
>;
/**
 * Given a Table,
 *  - sets the this.playerIds of the caller to be the players
 *    at the Table
 *  - sets this.serializedTable to a serialied version of the Table
 *  - sets this.deserializedTable to the Table
 *
 * Intended to be used as a setter for the virtual table field
 * (c.f. https://mongoosejs.com/docs/guide.html#virtuals)
 *
 * @param this a VirtualTableSetterThis
 * @param t a Table
 */
export const virtualTableSetter = function (
  this: VirtualTableSetterThis,
  t: Table
) {
  this.playerIds = getPlayerIds(t);
  this.serializedTable = serialize(t);
  this.deserializedTable = t;
};

type VirtualTableGetterThis = Pick<
  DeserializedPokerRoomDoc,
  "deserializedTable"
>;
/**
 * Returns this.deserializedTable
 *
 * Intended to be used as a setter for the virtual table field
 * (c.f. https://mongoosejs.com/docs/guide.html#virtuals)
 *
 * @param this a VirtualTableGetterThis
 * @returns this.deserializedTable
 */
export const virtualTableGetter = function (this: VirtualTableGetterThis) {
  return this.deserializedTable;
};

PokerRoomSchema.virtual("table")
  .set(virtualTableSetter)
  .get(virtualTableGetter);

type PostInitDeserializeTableThis = Pick<
  SerializedPokerRoomDoc,
  "serializedTable"
>;
/**
 * Initializes the virtual table field after document has been returned
 * from MongoDB.
 * @param this a PostInitDeserializeTableThis
 */
export const postInitDeserializeTable = function (
  this: PostInitDeserializeTableThis
) {
  virtualTableSetter.call(this, deserialize(this.serializedTable));
};
PokerRoomSchema.post("init", postInitDeserializeTable);

type PreValidateSerializeTableThis = Pick<
  DeserializedPokerRoomDoc,
  "deserializedTable"
>;
/**
 * Sets the virtual table field before writing to MongoDB.
 *
 * Note: This ensures that mutations to virtual table are also reflected
 * in relevant SerializedPokerRoomDoc fields (i.e. serializedTable, playerIds)
 * before it is written to DB
 *
 * @param this a VirtualTableSetterThis
 */
export const preValidateSerializeTable = function (
  this: PreValidateSerializeTableThis
) {
  virtualTableSetter.call(this, this.deserializedTable);
};
PokerRoomSchema.pre("validate", preValidateSerializeTable);

/**
 * The public interface for a PokerRoom
 *
 */
export interface PokerRoomDoc {
  /** The mutable name of the room */
  name: string;

  /** The immutable id of the creator */
  readonly creatorId: string;

  /**
   * The ids of players at the table.
   *
   * Not directly mutable via assignment or array mutation methods.
   * Mutated implicitly via state of table field.
   *
   * Represented outside the table to alllow for index-based queries
   */
  readonly playerIds: readonly string[];

  /** The table */
  table: Table;
}

export default PokerRoomSchema;
