import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { Theme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { SxProps } from "@mui/system";
import { PokerRooms } from "@pokester/common-api";
import { FC, useEffect } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { object } from "yup";
import { ActInRoomMutation } from "../../../queries/poker-rooms";

export const amountLabel = "amount";

type VariableWagerActReqBody = PokerRooms.Act.VariableWagerActReqBody;
type AmountOnlyActReqBody = Pick<VariableWagerActReqBody, "amount">;

export type BetFormProps = Pick<VariableWagerActReqBody, "action"> & {
  actInRoom: ActInRoomMutation;
  amountAtRoundStart: number;
  currentRound?: PokerRooms.Get.BettingRound;
  disabled: boolean;
  buttonSx?: SxProps<Theme>;
};
/**
 * Given props, returns a form for entering a bet or raise.
 *
 * @param props
 * @param props.actInRoom an ActInRoom mutation
 * @param props.bigBlind the big blind for the room
 * @param props.currentRound the current round
 * @param props.disabled boolean indicating if the form should be disabled or
 *   not; set to true when betting/raising is not a legal action
 * @param props.buttonSx sx prop passed to button(s) in the form
 * @returns a form for entering a bet or raise
 */
const BetForm: FC<BetFormProps> = ({
  action,
  actInRoom,
  amountAtRoundStart,
  currentRound,
  disabled,
  buttonSx,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onTouched",
    defaultValues: { amount: amountAtRoundStart },
    resolver: yupResolver(
      object({ amount: PokerRooms.Act.ReqBodySchema.amountSchema })
    ) as Resolver<AmountOnlyActReqBody>,
  });

  useEffect(
    () => reset({ amount: amountAtRoundStart }),
    [reset, currentRound, amountAtRoundStart]
  );

  const disableSubmit =
    disabled ||
    actInRoom.isLoading ||
    isSubmitting ||
    (Object.keys(errors).length !== 0 && !isValid);

  const disableInput = disabled || actInRoom.isLoading || isSubmitting;

  const onSubmit = (reqBody: AmountOnlyActReqBody) =>
    actInRoom.mutate({ ...reqBody, action });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          disabled={disableSubmit}
          type="submit"
          sx={buttonSx}
        >
          {action}
        </Button>
        <Controller
          control={control}
          name="amount"
          render={({
            field: { ref, ...fieldSansRef },
            fieldState: { error },
            formState: { isValid },
          }) => {
            return (
              <TextField
                disabled={disableInput}
                fullWidth
                hiddenLabel
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                inputProps={{ "aria-label": amountLabel }}
                id={fieldSansRef.name}
                variant="filled"
                required
                error={!isValid && !!error}
                inputRef={ref}
                {...fieldSansRef}
              />
            );
          }}
        />
      </Stack>
    </form>
  );
};

export default BetForm;
