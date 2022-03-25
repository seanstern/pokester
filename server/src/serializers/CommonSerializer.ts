/**
 * Given an object, returns a JSON conformant version of the object.
 * @param obj any object
 * @param keysToOmit keys that could be serialzed as JSON but are to
 *   be excluded from the resulting object; applied recursively
 * @returns a JSON conformat version of the object
 */
export const serialize = (obj: any, keysToOmit: string[]): JSONValue =>
  JSON.parse(
    JSON.stringify(obj, (key, value) =>
      keysToOmit.includes(key) ? undefined : value
    )
  );

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[];
type JSONArray = JSONValue[];
type JSONObject = { [x: string]: JSONValue };

export type Deserialize<T> = (json: JSONValue) => T;

/**
 * Given a JSONValue, returns true when it represent a string
 * and false otherwise.
 * @param json a JSONValue
 * @returns true when json is a string, false otherwise
 */
const isString = (json: JSONValue): json is string => typeof json === "string";

/**
 * Given a JSONValue that is a string, returns that string. Note:
 * this function is primarily used to validate that the JSONValue is
 * a string type.
 * @param json a JSONValue that is a string
 * @returns the string
 */
export const deserializeString: Deserialize<string> = (json: JSONValue) => {
  if (!isString(json)) {
    throw new Error("Cannot deserialize JSON that is not string");
  }
  return json;
};

/**
 * Given a JSONValue, returns true when it represent a number
 * and false otherwise.
 * @param json a JSONValue
 * @returns true when json is a number, false otherwise
 */
const isNumber = (json: JSONValue): json is number => typeof json === "number";

/**
 * Given a JSONValue that is a number, returns that string. Note:
 * this function is primarily used to validate that the JSONValue is
 * a number type.
 * @param json a JSONValue that is a number
 * @returns the number
 */
export const deserializeNumber: Deserialize<number> = (json: JSONValue) => {
  if (!isNumber(json)) {
    throw new Error("Cannot deserialize JSON that is not number");
  }
  return json;
};

/**
 * Given a JSONValue, returns true when it represent a boolean
 * and false otherwise.
 * @param json a JSONValue
 * @returns true when json is a boolean, false otherwise
 */
const isBoolean = (json: JSONValue): json is boolean =>
  typeof json === "boolean";

/**
 * Given a JSONValue that is a boolean, returns that boolean. Note:
 * this function is primarily used to validate that the JSONValue is
 * a boolean type.
 * @param json a JSONValue that is a boolean
 * @returns the boolean
 */
export const deserializeBoolean: Deserialize<boolean> = (json: JSONValue) => {
  if (!isBoolean(json)) {
    throw new Error("Cannot deserialize JSON that is not boolean");
  }
  return json;
};

/**
 * Given a JSONValue, returns true when it represent a JSONArray
 * and false otherwise.
 * @param json a JSONValue
 * @returns true when json is a JSONArray, false otherwise
 */
const isJSONArray = (json: JSONValue): json is JSONArray => Array.isArray(json);

/**
 * Given a function that deserializes elements of an array,
 * returns a function that will deserialize an array.
 * @param deserializeElement a function that deserializes
 *   individual elements
 * @returns a function that will deserialize an array; function
 *   takes json and returns a list of deserialized elements
 */
export const createDeserializeArrayFn = <T>(
  deserializeElement: Deserialize<T>
): Deserialize<T[]> => (json: JSONValue) => {
  if (!isJSONArray(json)) {
    throw new Error("Cannot deserialize JSON that is not array");
  }
  return json.map(deserializeElement);
};

/**
 * Given a JSONValue, returns true when it represent an object and
 * false otherwise.
 * @param json a JSONValue
 * @returns true when json is a JSONObject, false otherwise
 */
const isJSONObject = (json: JSONValue): json is JSONObject =>
  typeof json === "object" && !Array.isArray(json);

export type ArgumentsDeserializationSpec<T extends any[]> = {
  [K in keyof T]: {
    serializedKeyName: string;
    deserialize: Deserialize<T[K]>;
  };
};
/**
 * Given an argument deserialization specification (a list of
 * {serializedKey, deserialize} objects), returns a function
 * that will deserialize an object matching the specification.
 *
 * @param ads an argument deserialization specification (a
 *   list of {serializedKey, deserialize} objects)
 * @returns a function that will deserialize an object matching
 *   the specificaiton; function takes json and returns
 *   a list of deserialized values
 */
export const creatDeserializeArgumentsFn = <T extends any[]>(
  ads: ArgumentsDeserializationSpec<T>
): Deserialize<T> => (json: JSONValue) =>
  ads.map(({ serializedKeyName, deserialize }) => {
    if (!isJSONObject(json)) {
      throw new Error("Cannot deserialize JSON that is not object");
    }
    try {
      return deserialize(json[serializedKeyName]);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `${err.message}
          Cannot deserialize key "${serializedKeyName}" in JSONObject`
        );
      }
      throw err;
    }
  }) as T;

export type FieldDeserializationSpec<T, K extends keyof T> = {
  [P in K]: Deserialize<T[P]>;
};
/**
 * Given a field deserialization specification (a map of type
 * {[key: string]: deserialize}), returns a function
 * that will deserialize an object matching the specification.
 * @param fds a field deserialization specification (a map of
 *   {[key: string]: deserialize}), returns a function
 *   that will deserialize an object matching the specificaiton
 * @returns a function that will deserialize an object matching
 *   the specification; function takes json and returns a
 *   a map of the type {[key: string]: deserialize}
 */
export const createDeserializeFieldsFn = <T, K extends keyof T>(
  fds: FieldDeserializationSpec<T, K>
): Deserialize<Pick<T, K>> => (json: JSONValue) =>
  Object.entries<Deserialize<any>>(fds).reduce((obj, [key, deserialize]) => {
    if (!isJSONObject(json)) {
      throw new Error("Cannot deserialize field from JSON that is not object");
    }
    try {
      obj[key] = deserialize(json[key]);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(
          `${err.message}
          Cannot deserialize key "${key}" in JSONObject`
        );
      }
      throw err;
    }
    return obj;
  }, {} as { [key: string]: any }) as T;
