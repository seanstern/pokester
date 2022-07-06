// eslint-disable-next-line @typescript-eslint/ban-types
export type Unserializable = Function | symbol | bigint | undefined;
const UNSERIALIZABLE_TYPES_TYPE_OF_VALUES = [
  "function",
  "symbol",
  "bigint",
  "undefined",
];
/**
 * Given an object, returns a JSON conformant version of the object.
 *
 * @param obj any object
 * @param keysToOmit keys that could be serialzed as JSON but are to
 *   be excluded from the resulting object; applied recursively
 * @returns a JSON conformant version of the object
 */
export const serialize = <T>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  v: Exclude<T, Function | symbol | bigint | undefined>,
  ...keysToOmit: string[]
): JSONValue => {
  if (UNSERIALIZABLE_TYPES_TYPE_OF_VALUES.includes(typeof v)) {
    throw new Error(`Cannot serialize ${typeof v}`);
  }
  return JSON.parse(
    JSON.stringify(v, (key, value) =>
      keysToOmit.includes(key) ? undefined : value
    )
  );
};

export type JSONValue =
  | null
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[];
type JSONArray = JSONValue[];
type JSONObject = { [x: string]: JSONValue };

export type Deserialize<T, C = unknown> = (
  json: JSONValue,
  mutableContext?: C
) => T;

/**
 * Given a JSONValue, returns true when it represent a string
 * and false otherwise.
 *
 * @param json a JSONValue
 * @returns true when json is a string, false otherwise
 */
const isString = (json: JSONValue): json is string => typeof json === "string";

/**
 * Given a JSONValue that is a string, returns that string. Note:
 * this function is primarily used to validate that the JSONValue is
 * a string type.
 *
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
 *
 * @param json a JSONValue
 * @returns true when json is a number, false otherwise
 */
const isNumber = (json: JSONValue): json is number => typeof json === "number";

/**
 * Given a JSONValue that is a number, returns that string. Note:
 * this function is primarily used to validate that the JSONValue is
 * a number type.
 *
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
 *
 * @param json a JSONValue
 * @returns true when json is a boolean, false otherwise
 */
const isBoolean = (json: JSONValue): json is boolean =>
  typeof json === "boolean";

/**
 * Given a JSONValue that is a boolean, returns that boolean. Note: this
 * function is primarily used to validate that the JSONValue is a boolean type.
 *
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
 * Given a JSONValue, returns true when it represent a JSONArray and false
 * otherwise.
 *
 * @param json a JSONValue
 * @returns true when json is a JSONArray, false otherwise
 */
const isJSONArray = (json: JSONValue): json is JSONArray => Array.isArray(json);

/**
 * Given a function that deserializes elements of an array, returns a
 * function that will deserialize an array.
 *
 * @param deserializeElement a function that deserializes an individual
 *   element
 * @returns a function that will deserialize an array; function takes a
 *   JSONValue and an optional mutableContext, and returns a list of
 *   deserialized elements
 */
export const createDeserializeArrayFn =
  <T, C = unknown>(
    deserializeElement: Deserialize<T, C>
  ): Deserialize<T[], C> =>
  (json: JSONValue, mutableContext?: C) => {
    if (!isJSONArray(json)) {
      throw new Error("Cannot deserialize JSON that is not array");
    }
    return json.map((value, index) => {
      try {
        return deserializeElement(value, mutableContext);
      } catch (err) {
        if (err instanceof Error) {
          throw new Error(
            `${err.message}
          Cannot deserialize element ${index} in array`
          );
        }
        throw err;
      }
    });
  };

/**
 * Given a JSONValue, returns true when it represent an object and false
 * otherwise.
 *
 * @param json a JSONValue
 * @returns true when json is a JSONObject, false otherwise
 */
const isJSONObject = (json: JSONValue): json is JSONObject =>
  json !== null && typeof json === "object" && !Array.isArray(json);

export type ArgumentsDeserializationSpec<T extends any[], C = unknown> = {
  [K in keyof T]: {
    serializedKeyName: string;
    deserialize: Deserialize<T[K], C>;
  };
};
/**
 * Given an argument deserialization specification (a list of
 * { serializedKey, deserialize } objects), returns a function that will
 * deserialize an object matching the specification.
 *
 * @param ads an argument deserialization specification (a list of
 *  { serializedKey, deserialize } objects)
 * @returns a function that will deserialize an object matching the
 *  specificaiton; function takes a JSONValue and an optional mutableContext,
 *  and returns a list of deserialized values
 */
export const createDeserializeArgumentsFn =
  <T extends any[], C = unknown>(
    ads: ArgumentsDeserializationSpec<T, C>
  ): Deserialize<T, C> =>
  (json: JSONValue, mutableContext?: C) =>
    ads.map(({ serializedKeyName, deserialize }) => {
      if (!isJSONObject(json)) {
        throw new Error("Cannot deserialize JSON that is not object");
      }
      try {
        return deserialize(json[serializedKeyName], mutableContext);
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

export type FieldDeserializationSpec<
  T,
  K extends keyof T,
  C = unknown
> = Required<{
  [P in K]: Deserialize<T[P]> | Deserialize<T[P], C>;
}>;
/**
 * Given a field deserialization specification (a map of type
 * { [key: string]: deserialize }), returns a function that will deserialize an
 * object matching the specification.
 *
 * @param fds a field deserialization specification (a map of
 *   { [key: string]: deserialize} ), returns a function that will deserialize
 *   an object matching the specificaiton
 * @returns a function that will deserialize an object matching the
 *   specification; function takes a JSONValue an optional mutableContext, and
 *   returns a deserialized object matching the specification
 */
export const createDeserializeFieldsFn =
  <T, K extends keyof T, C = unknown>(
    fds: FieldDeserializationSpec<T, K, C>
  ): Deserialize<Pick<T, K>, C> =>
  (json: JSONValue, mutableContext?: C) => {
    if (!isJSONObject(json)) {
      throw new Error("Cannot deserialize field from JSON that is not object");
    }
    return Object.entries<Deserialize<any, C>>(fds).reduce(
      (obj, [key, deserialize]) => {
        try {
          obj[key] = deserialize(json[key], mutableContext);
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
      },
      {} as { [key: string]: any }
    ) as T;
  };

/**
 * Given a deserialized object and fields that should be assigned to the
 * the deserialized object, assigns all of the defined properties in the
 * fields object to the deserialized object; returns the mutated deserialized
 * object
 *
 * Note: This differs from Object.assign by
 *   - Restricting fields of sourceFields to those properly typed on
 *     targetMutableObj
 *   - NOT assigning undefined fields on sourceFields
 *
 * @param targetMutableObj deserialized object to be assigned
 *   properties of fields
 * @param sourceFields fields to assign to
 *   targetMutableObj
 * @returns a mutated version of targetMutableObj
 */
export const assignDeserializedFieldsTo = <T>(
  targetMutableObj: T,
  sourceDeserializedFields: Partial<T>
): T => {
  for (const key in sourceDeserializedFields) {
    const typedKey = key as keyof typeof sourceDeserializedFields;
    if (sourceDeserializedFields[typedKey] !== undefined) {
      targetMutableObj[typedKey] = sourceDeserializedFields[
        typedKey
      ] as T[typeof typedKey];
    }
  }
  return targetMutableObj;
};

/**
 * Given a deserialization function, returns a version of the function that
 * allows for the deserialization of an undefined JSONValue
 *
 * @param deserialize a deserializeation function; a function
 *   that takes JSONValue and an optional mutableContext, and returns a
 *   deserialized version of that value
 * @returns a deserialization function that allows for the
 *   deserialization of an undefined JSONValue
 */
export const createDeserializeOptionalFn =
  <T, C = unknown>(deserialize: Deserialize<T, C>) =>
  (json?: JSONValue, mutableContext?: C) => {
    if (json === undefined) {
      return undefined;
    }
    return deserialize(json, mutableContext);
  };

/**
 * Given a deserialization function, returns a version of the function that
 * allows for the deserialization of a null JSONValue
 *
 * @param deserialize a deserializeation function; a function that takes
 *   JSONValue and an optional mutableContext, returns a deserialized version
 *   of that value
 * @returns a deserialization function that allows for the
 *   deserialization of a null JSONValue
 */
export const createDeserializeNullableFn =
  <T, C = unknown>(deserialize: Deserialize<T, C>): Deserialize<T | null, C> =>
  (json: JSONValue, mutableContext?: C) => {
    if (json === null) {
      return null;
    }
    return deserialize(json, mutableContext);
  };
