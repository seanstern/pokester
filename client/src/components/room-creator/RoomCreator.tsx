import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { PokerRooms } from "@pokester/common-api";
import startCase from "lodash/startCase";
import { FC } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { NumberSchema, reach } from "yup";
import { useCreate } from "../../queries/poker-rooms";
import getBadRequestErrorMessage from "../../utils/getBadRequestErrorMessage";
import getTextFieldErrorInfoProps from "../form-utils/getTextFieldErrorInfoProps";
import ErrorSnackbar from "../utils/ErrorSnackbar";
import LoadingProgress from "../utils/LoadingProgress";

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

  const disableSubmitButton =
    isSubmitting || (Object.keys(errors).length > 0 && !isValid);
  const disableInput = isSubmitting;
  return (
    <>
      <ErrorSnackbar
        show={create.isError && !create.isLoading}
        message={getBadRequestErrorMessage(create.error)}
      ></ErrorSnackbar>
      <LoadingProgress show={create.isLoading} />
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
                  disabled={disableInput}
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
                    disabled={disableInput}
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
              disabled={disableInput}
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
                  disabled={disableInput}
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
            disabled={disableSubmitButton}
          >
            {createLabel}
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default RoomCreator;
