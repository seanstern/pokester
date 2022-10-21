import { Player, Table } from "@chevtek/poker-engine";
import { Model, Schema, Query } from "mongoose";
import { deserialize, serialize } from "../../serializers/TableSerializer";

/**
 * The interface for a PokerRoom Document feteched from MongoDB
 *
 * Intended to be private because clients should NOT have
 *   - write access to creatorId
 *   - read or write access to serializedTable; it merely
 *     supplies the information to produce a deserialzed
 *     Table instance (which clients CAN access); its value
 *     is written pre-save based on deserialized Table
 *     instance
 *   - read or write access to playerIds; it merely supplies index-based
 *     querying for playerIds that are otherwise inaccessible
 *     in the serializedTable instance; read access implicitly exposed
 *     through query helpers
 *   - read or write access to playerIdsCount; it merely supplies a
 *     field for range based querying of the number of players which
 *     is otherwise inacessible in playerIds (see
 *     https://www.mongodb.com/docs/manual/reference/operator/query/size/);
 *     read access implicitly exposed through query helpers
 *
 * See PublicPokerRoomDoc for fields that are intended for clients
 *
 * This interface is useful for private read and writes via middleware
 * (c.f. https://mongoosejs.com/docs/middleware.html) which is why all fields
 * are optional (e.g. a projection could limit access to a field)
 */
export type SerializedPokerRoomDoc = {
  /** The name of the room */
  name?: string;

  /** The id of the user who created the room */
  creatorId?: string;

  /** JSON representation of a Table */
  serializedTable?: any;

  /**
   * The ids of players in the room.
   *
   * Represented outside the serializedTable for indexing and playerId
   * based queries
   */
  playerIds?: string[];

  /**
   * The count of elements in playerIds.
   *
   * Respresented outside playerIds for range based querying
   * (see https://www.mongodb.com/docs/manual/reference/operator/query/size/)
   */
  playerIdsCount?: number;
};

// The maxium number of players that can sit at a table
// Defined by @chevtek/poker-engine
export const MAX_PLAYER_IDS_LENGTH = 10;

type CanSitThis = Partial<Pick<SerializedPokerRoomDoc, "playerIds">>;
/**
 * Given a SerializedPokerRoomDoc with the playerIds field present and
 * a player id, returns true when the playerId could be seated at the
 * underlying serializedTable; false otherwise.
 *
 * Used as implementation of the PublicPokerRoomModel's canSit method.
 *
 * This same information could be extracted from a deserialized table
 * field. However, this other approach would require selecting/projection
 * for the serializedTable and then deserailizing it whenever this
 * information was needed--which in many cases is excessive.
 *
 * @param this a SerializedPokerRoomDoc with non-nullish playerIds field
 * @param playerId a player id
 * @returns true when the playerId could be seated at
 *   SerializedPokerRoomDoc's underlying serializedTable; false otherwise
 */
export const canSit = function (this: CanSitThis, playerId: string): boolean {
  if (!this.playerIds) {
    throw new Error('canSit requires non-nullish "playerIds" field');
  }
  return (
    this.playerIds.length < MAX_PLAYER_IDS_LENGTH &&
    !this.playerIds.includes(playerId)
  );
};

type IsSeatedThis = Partial<Pick<SerializedPokerRoomDoc, "playerIds">>;
/**
 * Given a SerializedPokerRoomDoc with the playerIds field present and
 * a player id, returns true when the player id is seated at the
 * underlying serializedTable; false otherwise.
 *
 * Used as implementation of the PublicPokerRoomModel's isSeated method.
 *
 * This same information could be extracted from a deserialized table
 * field. However, this other approach would require selecting/projecting
 * for the serializedTable and then deserailizing it whenever this
 * information was needed--which in many cases is excessive.
 *
 * @param this a SerializedPokerRoomDoc with non-nullish playerIds field
 * @param playerId a player id
 * @returns true when the player id is seated at
 *   SerializedPokerRoomDoc's underlying serializedTable; false otherwise
 */
export const isSeated = function (
  this: IsSeatedThis,
  playerId: string
): boolean {
  if (!this.playerIds) {
    throw new Error('isSeated requires non-nullish "playerIds" field');
  }
  return this.playerIds.includes(playerId);
};

type SerializedPokerRoomMethodsAndOverrides = {
  canSit: typeof canSit;
  isSeated: typeof isSeated;
};

/**
 * Given a query on a SerializedPokerRoomDoc, a player id, and a desired value
 * for that player's ability to sit at the underlying serializedTable, returns
 * a mutated query that will filter for those SerializedPokerRoomDocs where
 * the given player's ability to sit aligns to the provided value.
 *
 * @param this a query on a SerializedPokerRoomDoc
 * @param playerId a player id
 * @param canSit a desired value for the above player's ability to sit
 * @returns a mutated query for SerializedPokerROomDoc(s) with a filter set for
 *   those SerializedPokerRoomDocs where the given player's ability to sit
 *   aligns with the provided value.
 */
export const byCanPlayerSit = function (
  this: Query<any, SerializedPokerRoomDoc>,
  playerId: string,
  canSit: boolean
) {
  // Uses "and" query helper to handle situaitons this query helper is used in
  // conjunction with byIsPlayerSeated and both are filtering on true.
  // Without and, playerIds filter field would be constructed in "last called
  // wins" fashion. For example:
  //
  // query.byCanPlayerSit(id, true).byIsSeated(id, true) =>
  //  { playerIdsCount: { $lt: MAX_PLAYER_IDS_LENGTH }, playerIds: id }
  //
  // query.byIsSeated(id, true).byCanPlayerSit(id, true) =>
  //  { playerIdsCount: { $lt: MAX_PLAYER_IDS_LENGTH }, playerIds: { $ne: id } }
  if (canSit) {
    return this.and([
      { playerIdsCount: { $lt: MAX_PLAYER_IDS_LENGTH } },
      { playerIds: { $ne: playerId } },
    ]);
  }
  return this.and([
    {
      $or: [
        { playerIdsCount: { $gte: MAX_PLAYER_IDS_LENGTH } },
        { playerIds: playerId },
      ],
    },
  ]);
};

/**
 * Given a query on a SerializedPokerRoomDoc, a player id and a desired value
 * for that player's seated status the underlying serializedTable, returns
 * a muatted query that will filter for those SerializedPokerRoomDocs where
 * the given player's seated status aligns to the provided value.
 *
 * @param this a query on a SerializedPokerRoomDoc
 * @param playerId a player id
 * @param canSit a desired value for the above player's seated status
 * @returns a mutated query for SerializedPokerRoomDoc(s) with a filter set for
 *   those SerializedPokerRoomDocs where the given player's seated status
 *   aligns with the provided value.
 */
export const byIsPlayerSeated = function (
  this: Query<any, SerializedPokerRoomDoc>,
  playerId: string,
  isSeated: boolean
) {
  // Uses "and" query helper to handle situaitons this query helper is used in
  // conjunction with byIsPlayerSeated and both are filtering on true.
  // Without and, playerIds filter field would be constructed in "last called
  // wins" fashion. For example:
  //
  // query.byCanPlayerSit(id, true).byIsSeated(id, true) =>
  //  { playerIdsCount: { $lt: MAX_PLAYER_IDS_LENGTH }, playerIds: id }
  //
  // query.byIsSeated(id, true).byCanPlayerSit(id, true) =>
  //  { playerIdsCount: { $lt: MAX_PLAYER_IDS_LENGTH }, playerIds: { $ne: id } }
  if (isSeated) {
    return this.and([{ playerIds: playerId }]);
  }
  return this.and([{ playerIds: { $ne: playerId } }]);
};

type SerializedPokerRoomQueryHelpers = {
  byCanPlayerSit: typeof byCanPlayerSit;
  byIsPlayerSeated: typeof byIsPlayerSeated;
};

export type SerializedPokerRoomModel = Model<
  SerializedPokerRoomDoc,
  SerializedPokerRoomQueryHelpers,
  SerializedPokerRoomMethodsAndOverrides,
  { table?: Table }
>;
const PokerRoomSchema = new Schema<
  SerializedPokerRoomDoc,
  SerializedPokerRoomModel,
  SerializedPokerRoomMethodsAndOverrides,
  SerializedPokerRoomQueryHelpers
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
    playerIdsCount: {
      type: Number,
      required: true,
      index: true,
    },
    creatorId: {
      type: String,
      required: true,
      immutable: true,
      index: true,
    },
    serializedTable: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    optimisticConcurrency: true,
    timestamps: true,
    methods: {
      canSit,
      isSeated,
    },
    query: {
      byCanPlayerSit,
      byIsPlayerSeated,
    },
  }
);

PokerRoomSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 2 }
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
type DeserializedPokerRoomDoc = SerializedPokerRoomDoc & {
  deserializedTable?: Table;
};

/**
 * Given a Table, returns the ids of each of the players at the Table.
 * @param t a Table
 * @returns an array containing the ids of each of the player sat the Table.
 */
export const getPlayerIds = (t: Table) =>
  (t.players.filter((p) => p !== null) as Player[]).map((p) => p.id);

type VirtualTableSetterThis = Partial<
  Pick<
    DeserializedPokerRoomDoc,
    "playerIds" | "serializedTable" | "deserializedTable" | "playerIdsCount"
  >
>;
/**
 * Given a Table,
 *  - sets the this.playerIds of the caller to be the players
 *    at the Table
 *  - set the this.playersCount of the caller to be the number
 *    of players at the Table
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
  this.playerIdsCount = this.playerIds.length;
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
 * from MongoDB, provided that serialiedTable is in the projection.
 * @param this a PostInitDeserializeTableThis
 */
export const postInitDeserializeTable = function (
  this: PostInitDeserializeTableThis
) {
  if (this.serializedTable) {
    virtualTableSetter.call(this, deserialize(this.serializedTable));
  }
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
  if (this.deserializedTable) {
    virtualTableSetter.call(this, this.deserializedTable);
  }
};
PokerRoomSchema.pre("validate", preValidateSerializeTable);

/**
 * The public interface for a PokerRoom Document
 */
export type PublicPokerRoomDoc = {
  /** The mutable name of the room */
  name?: string;

  /** The immutable id of the creator */
  readonly creatorId?: string;

  /** The player Ids seated at the table */
  readonly playerIds?: readonly string[];

  /** The table */
  table?: Table;
};

/**
 * The public methods and overrides for a PokerRoom Document
 */
type PublicPokerRoomMethodsAndOverrides = {
  /**
   * Method that, given a playerId, returns true when the playerId could be
   * seated at the PokerRoom's underlying table; false otherwise.
   *
   * Note: the invoking object needs ONLY playerIds to be defined (i.e. should
   * not be excluded from the query projection).
   *
   * Note: This same information could be extracted from the table field. However
   * this approach requires selecting/projecting for serializedTable, deserializing,
   * and calling utility method on table.
   */
  canSit: (
    this: Pick<PublicPokerRoomDoc, "playerIds">,
    playerId: string
  ) => boolean;
  /**
   * Method that, given a playerId, returns true when the playerId is
   * seated at the PokerRoom's underlying table; false otherwise.
   *
   * Note: the invoking object needs ONLY playerIds to be defined (i.e. should
   * not be excluded from the query projection).
   *
   * Note: This same information could be extracted from the table field. However
   * this approach requires selecting/projecting for serializedTable, deserializing,
   * and calling utility method on table.
   */
  isSeated: (
    this: Pick<PublicPokerRoomDoc, "playerIds">,
    playerId: string
  ) => boolean;
};

/**
 * The public query helpers for a PokerRoom model
 */
type PublicPokerRoomQueryHelpers = {
  /**
   * Method that, given a player, and a desired value for that
   * player's ability to sit a the underlying table, returns
   * a mutated query that will filter for those PokerRoom docs where the given
   * player's seated status aligns to the provided value.
   */
  byCanPlayerSit: <T extends Query<any, PublicPokerRoomDoc>>(
    this: T,
    playerId: string,
    canSit: boolean
  ) => T;
  /**
   *
   */
  byIsPlayerSeated: <T extends Query<any, PublicPokerRoomDoc>>(
    this: T,
    playerId: string,
    isSeated: boolean
  ) => T;
};

export type PublicPokerRoomModel = Model<
  PublicPokerRoomDoc,
  PublicPokerRoomQueryHelpers,
  PublicPokerRoomMethodsAndOverrides,
  Record<string, never>
>;

export default PokerRoomSchema;
