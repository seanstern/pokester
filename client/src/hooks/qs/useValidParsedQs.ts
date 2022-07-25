import { parse, ParsedQs } from "qs";
import { useLocation } from "react-router-dom";

export type IsValidParsedQsValue<T extends ParsedQs["key"]> = (
  value: ParsedQs["key"]
) => value is T;
export type ValidParsedQsSpec<T extends ParsedQs> = {
  [qsKey in keyof T]: IsValidParsedQsValue<T[qsKey]>;
};
/**
 * Given a query string and a map of [query string key, validity check
 * function], returns an object map of [query key, query value] for those
 * query keys that are 1) in the query string and 2) whose values pass the
 * validity check.
 *
 * @param queryString a query string of a URL
 * @param validParsedQsSpec an object map of [query string key, valdity check
 *   function]
 * @returns an object map of [query key, query value] for those query keys
 *   that pass the validity check in isValidParsedQsMap
 */
export const getValidParsedQs = <T extends ParsedQs>(
  queryString: string,
  validParsedQsSpec: ValidParsedQsSpec<T>
): Partial<T> => {
  const parsedQs = parse(queryString, { ignoreQueryPrefix: true });

  const validParsedQs = {} as Partial<T>;

  for (const queryKey in validParsedQsSpec) {
    const IsValidParsedQsValue = validParsedQsSpec[queryKey];
    const queryValue = parsedQs[queryKey];
    if (IsValidParsedQsValue(queryValue)) {
      validParsedQs[queryKey] = queryValue;
    }
  }

  return validParsedQs;
};

export type ValidParsedQs<T> = Partial<T>;
/**
 * Given an object map of [query string key, validity check function], returns
 * an object map of [query key, query value] for those query keys in the URL
 * query string that pass the provided validity check.
 *
 * @param validParsedQsSpec an object map [query string key, validity check
 *   function]
 * @returns an object map of [query key, query value] for those query keys in
 *   the URL query string that pass the provided validity check
 */
const useValidParsedQs = <T extends ParsedQs>(
  validParsedQsSpec: ValidParsedQsSpec<Required<T>>
): ValidParsedQs<T> => {
  const { search } = useLocation();

  return getValidParsedQs(search, validParsedQsSpec);
};

export default useValidParsedQs;
