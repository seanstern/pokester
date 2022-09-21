import { mixed, number, object, SchemaOf } from "yup";
import { userFriendlyNumberTypeError } from "../SchemaUtils";
import { PlayerAction, ReqBody } from "./Types";

export const minSeatNumber = 0;
export const maxSeatNumber = 9;
const seatNumberScheam = number()
  .optional()
  .integer()
  .min(minSeatNumber)
  .max(maxSeatNumber);

export const amountSchema = number()
  .typeError(userFriendlyNumberTypeError)
  .required()
  .positive();

const reqBodySchema: SchemaOf<ReqBody> = object({
  action: mixed().required().oneOf(Object.values(PlayerAction)),
  amount: mixed().when(
    "action",
    (action: PlayerAction, schema: ReturnType<typeof mixed>) =>
      [PlayerAction.BET, PlayerAction.RAISE].includes(action)
        ? amountSchema
        : schema.strip()
  ),
  seatNumber: mixed().when(
    "action",
    (action: PlayerAction, schema: ReturnType<typeof mixed>) =>
      PlayerAction.SIT === action ? seatNumberScheam : schema.strip()
  ),
});

export default reqBodySchema;
