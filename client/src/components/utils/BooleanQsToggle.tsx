import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typogrpahy from "@mui/material/Typography";
import { ParsedQs } from "qs";
import React, { useCallback, ReactElement, FC, useMemo } from "react";
import useValidQsState from "../../hooks/qs/useValidQsState";

const idSuffix = "-boolean-qs-toggle-group-label";

/**
 * Given any value, returns true when it is one of "true" or "false"; false
 * otherwise.
 *
 * @param v any value
 * @returns true when v is one of "true" or "false"; false otherwise
 */
const isValidParsedBooleanQsValue = (v: any): v is "true" | "false" =>
  typeof v === "string" && ["true", "false"].includes(v);

type BooleanQsToggleButtonProps = {
  label: string;
  child: ReactElement<any, any>;
};
type BooleanQsToggleProps = {
  qsKey: keyof ParsedQs;
  label: string;
  labelIdPrefix: string;
  trueButton: BooleanQsToggleButtonProps;
  falseButton: BooleanQsToggleButtonProps;
};
/**
 * Given props, returns a toggle button group that controls the value of an
 * optional query string key that can be "true" or "false".
 *
 * @param props
 * @param props.qsKey the optional query string key
 * @param props.labelIdPrefix the leading characters for the string
 *   that serves as the id for the aria-label for this component
 * @param props.label the label for the toggle button group
 * @param props.trueButton the props for button that sets qsKey to "true"
 * @param props.trueButton.label the label for the "true" button
 * @param props.trueButton.child the child element of the "true" button
 * @param props.falseButton the props for button that sets qsKey to "false"
 * @param props.falseButton.label the label for the "false" button
 * @param props.falseButton.child the child element of the "false" button
 *
 * @returns a toggle button group that controls the value of an optional query
 * string key that can be "true" or "false"
 */
const BooleanQsToggle: FC<BooleanQsToggleProps> = ({
  qsKey,
  labelIdPrefix,
  label,
  trueButton,
  falseButton,
}) => {
  const isValidParsedQsMap = useMemo(
    () => ({ [qsKey]: isValidParsedBooleanQsValue }),
    [qsKey]
  );
  const [{ [qsKey]: qsValue }, patchQs] = useValidQsState(isValidParsedQsMap);

  const labelId = `${labelIdPrefix}${idSuffix}`;

  const handleChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, inputValue: string | null) => {
      patchQs({ [qsKey]: inputValue });
    },
    [patchQs, qsKey]
  );

  return (
    <Box>
      <Typogrpahy
        component="h3"
        variant="caption"
        id={labelId}
        color={qsValue ? "primary" : "text.secondary"}
      >
        {label}
      </Typogrpahy>
      <ToggleButtonGroup
        value={qsValue ?? null}
        exclusive
        onChange={handleChange}
        size="medium"
        color="primary"
        aria-labelledby={labelId}
      >
        <ToggleButton value="true" aria-label={trueButton.label}>
          <Tooltip title={trueButton.label}>{trueButton.child}</Tooltip>
        </ToggleButton>
        <ToggleButton value="false" aria-label={falseButton.label}>
          <Tooltip title={falseButton.label}>{falseButton.child}</Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default BooleanQsToggle;
