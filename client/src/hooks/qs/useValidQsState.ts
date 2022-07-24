import { ParsedQs } from "qs";
import usePatchQs, { MutateQs } from "./usePatchQs";
import useValidParsedQs, {
  IsValidParsedQsValue,
  ValidParsedQsSpec,
  ValidParsedQs,
} from "./useValidParsedQs";

export type { IsValidParsedQsValue };

/**
 * Given a map of [query string key, validity check function], returns a tuple
 * containing
 *   1) an object of [query key, query value] (hereafter called the spec) for
 *   those query keys that are
 *     a) in the query string portion of the URL AND
 *     b) whose values pass the validity check
 *   2) a funciton that consumes a [query string key, new value] map (hereafter
 *   called a patch value map) which patches the query string portion of the
 *   URL where each key in the spec is updated to reflect either
 *     1) the correspondign patch value if the validity check passes OR
 *     2) no value (i.e the key is removed from the query string) if the
 *     validity check fails.
 *
 * @param validParsedQsSpec a map of [query string key, validity check
 *   function]
 * @returns a tuple containing
 *   1) an object of [query key, query value] (hereafter called the spec) for
 *   those query keys that are
 *     a) in the query string portion of the URL AND
 *     b) whose values pass the validity check
 *   2) a funciton that consumes a [query string key, new value] map (hereafter
 *   called a patch value map) which patches the query string portion of the
 *   URL where each key in the spec is updated to reflect either
 *     1) the correspondign patch value if the validity check passes OR
 *     2) no value (i.e the key is removed from the query string) if the
 *     validity check fails.
 */
const useValidQsState = <T extends ParsedQs>(
  validParsedQsSpec: ValidParsedQsSpec<T>
) => {
  const validParsedQs = useValidParsedQs(validParsedQsSpec);
  const patchQs = usePatchQs(validParsedQsSpec);
  return [validParsedQs, patchQs] as [ValidParsedQs<T>, MutateQs<T>];
};

export default useValidQsState;
