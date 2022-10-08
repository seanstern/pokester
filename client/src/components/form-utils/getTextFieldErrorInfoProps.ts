import { TextFieldProps } from "@mui/material/TextField";
import upperFirst from "lodash/upperFirst";
import { FieldError } from "react-hook-form";

/**
 * Given a boolean indicating whether or not an entire form is valid and
 * an optional field error, returns true when the entire form is invalid
 * and the field error exists; false otherwise.
 *
 * @param isFormValid boolean indicating whether or not an entire form is
 *   valid
 * @param error an optional field error
 * @returns true when the entire form is invalid and the field error
 *   exists
 */
const getTextFieldError = (isFormValid: boolean, error?: FieldError) =>
  !isFormValid && !!error;

/**
 * Given a boolean indicating whether or not an entire form is valid and
 * an optional field error, returns a formatted version of the error's
 * message when the error message exists AND the entire form is invalid;
 * a string containing a single space (i.e. " ") otherwise.
 *
 * @param isFormValid boolean indicating whether or not an entire form is valid
 * @param error an optional field error
 * @returns a formatted version of the error's message when the error message
 *   exists AND the entire form is invalid; " " otherwise
 */
const getTextFieldHelperText = (isFormValid: boolean, error?: FieldError) =>
  (!isFormValid && upperFirst(error?.message)) || " ";

/**
 * Given a boolean indicating whether or not an entire form is valid and
 * an optional field error, returns an object containing the error and
 * helperText props for a the field error's corresponding TextField.
 *
 * @param isFormValid boolean indicating whether or not an entire form is valid
 * @param error an optional field error
 * @returns an object containg the error and helperText props for the field
 *   error's corresponding TextField
 */
const getTextFieldErrorInfoProps = (
  isFormValid: boolean,
  error?: FieldError
): Pick<TextFieldProps, "error" | "helperText"> => ({
  error: getTextFieldError(isFormValid, error),
  helperText: getTextFieldHelperText(isFormValid, error),
});

export default getTextFieldErrorInfoProps;
