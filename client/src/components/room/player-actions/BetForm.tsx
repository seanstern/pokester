import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { object } from "yup";

export const amountLabel = "amount";
export const defaultAmount = 0.0;

type VariableWagerActReqBody = PokerRooms.Act.VariableWagerActReqBody;
type AmountOnlyActReqBody = Pick<VariableWagerActReqBody, "amount">;

export type BetFormProps = Pick<VariableWagerActReqBody, "action"> & {
  disabled: boolean;
  act: (reqBody: VariableWagerActReqBody) => void;
};
/**
 * Given props, returns a form for entering a bet or raise.
 *
 * @param props
 * @param props.disabled boolean indicating if the form should be disabled or
 *   not; set to true when betting/raising is not a legal action
 * @param props.act a callback that the betting/raising action
 * @returns a form for entering a bet or raise
 */
const BetForm: FC<BetFormProps> = ({ action, disabled, act }) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onTouched",
    defaultValues: { amount: defaultAmount },
    resolver: yupResolver(
      object({ amount: PokerRooms.Act.ReqBodySchema.amountSchema })
    ) as Resolver<AmountOnlyActReqBody>,
  });

  const disabledBecauseOfForm =
    isSubmitting || (Object.keys(errors).length !== 0 && !isValid);

  return (
    <form
      onSubmit={handleSubmit((reqBody: AmountOnlyActReqBody) =>
        act({ ...reqBody, action })
      )}
    >
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          disabled={disabled || disabledBecauseOfForm}
          type="submit"
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
                disabled={disabled}
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
