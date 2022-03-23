export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[];
export type JSONObject = { [x: string]: JSONValue };

/**
 * Given a JSONValue, returns true when it represent an object and
 * false otherwise.
 * @param json a JSONValue
 * @returns true when json is a JSONObject, false otherwise
 */
const isJSONObject = (json: JSONValue): json is JSONObject =>
  typeof json === "object" && !Array.isArray(json);

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

export type Deserialize<T> = (json: JSONValue) => T;

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
      throw new Error(
        `Cannot deserialize argument with serializeKeyName "${serializedKeyName}" from JSON that is not object`
      );
    }
    return deserialize(json[serializedKeyName]);
  }) as T;

export type FieldDeserializationSpec<T> = {
  [K in keyof T]: Deserialize<T[K]>;
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
export const createDeserializeFieldsFn = <T>(
  fds: FieldDeserializationSpec<T>
): Deserialize<T> => (json: JSONValue) =>
  Object.entries<Deserialize<any>>(fds).reduce((obj, [key, deserialize]) => {
    if (!isJSONObject(json)) {
      throw new Error(
        `Cannot deserialize argument "${key}" from JSON that is not object`
      );
    }
    obj[key] = deserialize(json[key]);
    return obj;
  }, {} as { [key: string]: any }) as T;
