import TextField from "@mui/material/TextField";
import debounce from "lodash/debounce";
import { ParsedQs } from "qs";
import React, { FC, useCallback, useMemo, useState } from "react";
import useValidQsState, {
  IsValidParsedQsValue,
} from "../../hooks/qs/useValidQsState";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/**
 * Given any value, returns true when it is a non-empty string; false
 * otherwise.
 *
 * @param v any value
 * @returns true when v is a non-empty string; false otherwise
 */
const isValidParsedNonemptyStringQsValue = (v: any): v is string =>
  typeof v === "string" && v.length > 0;

type QsSearchProps = {
  qsKey: keyof ParsedQs;
  isValidParsedQsValue?: IsValidParsedQsValue<string>;
  label: string;
};
/**
 * Given props, return a search field that controls the value of an optional
 * query string key.
 *
 * @param props
 * @param props.qsKey the query string key
 * @param props.isValidParsedQsValue a optional function that returns true when
 *   the value of qsKey is valid, false otherwise; default validity check is
 *   for a non-empty string
 * @param props.label the label for the serach field
 * @returns a search field that controls the value of an optional query string
 *   key specified by qsKey
 */
const QsSearch: FC<QsSearchProps> = ({
  qsKey,
  isValidParsedQsValue = isValidParsedNonemptyStringQsValue,
  label,
}) => {
  // On small screens, the search field shoudl be full width
  const theme = useTheme();
  const fullWidth = useMediaQuery(theme.breakpoints.only("xs"));

  // Without this memo, useValidQsState returns new patchQs upon every
  // render. This, in turn, causes a new debouncedPatchQs to be returned upon
  // every render. However, for debouncing to work, the same function must
  // be returned on every render (provided qsKey, isValidParsedQsValue are
  // stable).
  const validParsedQsSpec = useMemo(
    () => ({ [qsKey]: isValidParsedQsValue }),
    [qsKey, isValidParsedQsValue]
  );
  const [{ [qsKey]: partialQsValue }, patchQs] =
    useValidQsState(validParsedQsSpec);
  const debouncedPatchQs = useMemo(() => debounce(patchQs, 400), [patchQs]);

  const qsValue = partialQsValue || "";
  const [inputValue, setInputValue] = useState<string>(qsValue);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      // Debouncing needs to be skipped when search is empty because time gap
      // between empty input value and empty qs means means that non-empty
      // qs overrides TextField value. This leads to UI where users clear search
      // and search repopulates with stale qs value.
      const skipDebounce = newValue === "";
      setInputValue(newValue);
      if (skipDebounce) {
        debouncedPatchQs.cancel();
        debouncedPatchQs({ [qsKey]: newValue });
        debouncedPatchQs.flush();
      } else {
        debouncedPatchQs({ [qsKey]: newValue });
      }
    },
    [setInputValue, qsKey, debouncedPatchQs]
  );

  return (
    <TextField
      label={label}
      type="search"
      variant="outlined"
      size="medium"
      InputLabelProps={{ shrink: true }}
      onChange={handleChange}
      value={inputValue || qsValue}
      fullWidth={fullWidth}
    />
  );
};

export default QsSearch;
