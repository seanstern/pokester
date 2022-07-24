import { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { parse, stringify, ParsedQs } from "qs";

type IsValidPatchQsValue<T extends ParsedQs["key"]> = (
  value: any
) => value is T;
export type PatchQsSpec<T extends ParsedQs> = {
  [queryKey in keyof T]: IsValidPatchQsValue<T[queryKey]>;
};
export type PatchValueMap<T> = {
  [queryKey in keyof T]: any;
};

/**
 * Given a query string, a map of [query string key, validity check function]
 * (hereafter called a patch spec), and a map of [query string key, new value]
 * (hereafter called a patch value map),  returns a new, patched query string
 * where each key in the patch spec is updated to reflect either 1) the
 * correspondign patch value if the validity check passes or 2) no value (i.e
 * the key is removed from the query string) if the validity check fails.
 *
 * @example
 * const qs = "?foo=fooVal&bar=barVal&baz=bazVal";
 * const cpm = {
 *  foo: (v) => typeof v === "string" && v.length === 6,
 *  bar: (v) => typeof v === "string" && v === "barVal",
 * };
 * const nvm = { foo: "newVal", bar: "newVal" };
 * // returns "?foo=newVal&baz=bazVal"
 * patchQs(qs, cpm, bar);
 *
 * @param queryString a query string of a URL
 * @param patchQsSpec an object map of [query string key,
 *   valdity check function] (the patch spec)
 * @param patchValueMap an object map of [query string key, new value]
 *   (the patch value map)
 * @returns a new, patched query string where each key in the patch spec is
 *   updated to reflect either 1) the correspondign patch value if the validity
 *   check passes or 2) no value (i.e the key is removed from the query string)
 *   if the validity check fails.
 */
export const patchQs = <T extends ParsedQs>(
  queryString: string,
  patchQsSpec: PatchQsSpec<T>,
  patchValueMap: PatchValueMap<T>
): string => {
  const parsedQs = parse(queryString, { ignoreQueryPrefix: true });
  for (const queryKey in patchQsSpec) {
    const canPatchQsKey = patchQsSpec[queryKey];
    const patchVaue = patchValueMap[queryKey];
    if (canPatchQsKey(patchVaue)) {
      parsedQs[queryKey] = patchVaue;
    } else {
      delete parsedQs[queryKey];
    }
  }
  return stringify(parsedQs, { addQueryPrefix: true });
};

export type MutateQs<T> = (newValueMap: PatchValueMap<T>) => void;
/**
 * Given a map of [query string key, validity check function] (hereafter called
 * a patch spec), returns a funciton that consumes a [query string key, new
 * value] map (hereafter called a patch value map) and then patches the query
 * string portion of the URL where each key in the patch spec is updated to
 * reflect either 1) the correspondign patch value if the validity check passes
 * or 2) no value (i.e the key is removed from the query string) if the
 * validity check fails.
 *
 * @param patchQsSpec an object map of [query string key,
 *   valdity check function] (the patch spec)
 * @returns a function that consumes a patch value map and then patches the
 *   query strong poriton of the URL where each key in the patch spec is
 *   updated to reflect either 1) the corresponding patch value if the validity
 *   check passes or 2) no value (i.e. the key is removed from the query
 *   string portion of the URL) if the validity check fails.
 */
const usePatchQs = <T extends ParsedQs>(
  canUseNewValueToPatchQsMap: PatchQsSpec<T>
): MutateQs<T> => {
  const location = useLocation();
  const history = useHistory();
  return useCallback(
    (newValueMap: PatchValueMap<T>) => {
      location.search = patchQs(
        location.search,
        canUseNewValueToPatchQsMap,
        newValueMap
      );
      history.replace(location);
    },
    [canUseNewValueToPatchQsMap, location, history]
  );
};

export default usePatchQs;
