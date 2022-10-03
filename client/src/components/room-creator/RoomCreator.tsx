import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { PokerRooms } from "@pokester/common-api";
import startCase from "lodash/startCase";
import upperFirst from "lodash/upperFirst";
import React, { FC } from "react";
import { Controller, FieldError, Resolver, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { NumberSchema, reach } from "yup";
import { useCreate } from "../../queries/poker-rooms";
import ErrorSnackbar from "../utils/ErrorSnackbar";

const {
  nameLabel: rawNameLabel,
  smallBlindLabel: rawSmallBlindLabel,
  bigBlindLabel: rawBigBlindLabel,
  buyInLabel: rawBuyInLabel,
  default: reqBodySchema,
  defaultSmallBlind,
  defaultBigBlindToSmallBlindRatio,
  defaultBuyInToBigBlindRatio,
} = PokerRooms.Create.ReqBodySchema;

export const nameLabel = startCase(rawNameLabel);
export const smallBlindLabel = startCase(rawSmallBlindLabel);
export const bigBlindLabel = startCase(rawBigBlindLabel);
export const buyInLabel = startCase(rawBuyInLabel);
export const createLabel = "Create";

const smallBlindSchema = reach(reqBodySchema, "smallBlind") as NumberSchema;

/**
 * Given a smallBlind, attempts to return appropriate bigBlind according to
 * the defaultBigBlindToSmallBlindRatio. In cases where smallBlind cannot
 * be case to a number, returns 0.
 *
 * @param smallBlind a smallBlind
 * @returns smallBlind * defaultBigBlindToSmallBlindRatio when smallBlind
 *   can be cast to a number; 0 otherwise
 */
const getBigBlindTextFieldValue = (smallBlind: any) => {
  try {
    return (
      (smallBlindSchema.cast(smallBlind) || 0) *
      defaultBigBlindToSmallBlindRatio
    );
  } catch (err) {
    return 0;
  }
};

export { defaultSmallBlind };
export const defaultBigBlind = getBigBlindTextFieldValue(defaultSmallBlind);
export const defaultBuyIn =
  defaultSmallBlind *
  defaultBigBlindToSmallBlindRatio *
  defaultBuyInToBigBlindRatio;

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

/**
 * Returns the page containg a form for creating a new room.
 *
 * @returns the page containing a form for create a new room.
 */
const RoomCreator: FC = () => {
  const create = useCreate();
  const history = useHistory();
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      smallBlind: defaultSmallBlind,
      buyIn:
        defaultSmallBlind *
        defaultBigBlindToSmallBlindRatio *
        defaultBuyInToBigBlindRatio,
    },
    resolver: yupResolver(reqBodySchema) as Resolver<PokerRooms.Create.ReqBody>,
  });

  const onSubmit = async (createReqBody: PokerRooms.Create.ReqBody) => {
    try {
      const roomId = await create.mutateAsync(createReqBody);
      history.push(`/room/${roomId}`);
    } catch (err) {}
  };

  const enableSubmitButton =
    !isSubmitting && (Object.keys(errors).length === 0 || isValid);

  return (
    <>
      <ErrorSnackbar show={create.isError && !create.isLoading}></ErrorSnackbar>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          alignItems="stretch"
          sx={{ width: { xs: 1, md: 2 / 3 } }}
          spacing={1}
        >
          <Controller
            control={control}
            name="name"
            render={({
              field: { ref, ...fieldSansRef },
              fieldState: { error },
              formState: { isValid },
            }) => {
              return (
                <TextField
                  sx={{ alignSelf: "stretch" }}
                  id={fieldSansRef.name}
                  label={nameLabel}
                  variant="filled"
                  required
                  {...getTextFieldErrorInfoProps(isValid, error)}
                  inputRef={ref}
                  {...fieldSansRef}
                />
              );
            }}
          />
          <Stack direction="row" spacing={2}>
            <Controller
              control={control}
              name="smallBlind"
              render={({
                field: { ref, ...fieldSansRef },
                fieldState: { error },
                formState: { isValid },
              }) => {
                return (
                  <TextField
                    sx={{ width: 1 / 2 }}
                    id={fieldSansRef.name}
                    label={smallBlindLabel}
                    variant="filled"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    required
                    {...getTextFieldErrorInfoProps(isValid, error)}
                    inputRef={ref}
                    {...fieldSansRef}
                  />
                );
              }}
            />
            <TextField
              sx={{ width: 1 / 2 }}
              id="bigBlind"
              label={bigBlindLabel}
              variant="filled"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              helperText=" "
              value={getBigBlindTextFieldValue(watch("smallBlind"))}
            />
          </Stack>
          <Controller
            control={control}
            name="buyIn"
            render={({
              field: { ref, ...fieldSansRef },
              fieldState: { error },
              formState: { isValid },
            }) => {
              return (
                <TextField
                  id={fieldSansRef.name}
                  label={buyInLabel}
                  variant="filled"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  required
                  {...getTextFieldErrorInfoProps(isValid, error)}
                  inputRef={ref}
                  {...fieldSansRef}
                />
              );
            }}
          />
          <Button
            sx={{ alignSelf: "flex-start" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={!enableSubmitButton}
          >
            {createLabel}
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default RoomCreator;
