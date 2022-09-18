import { mixed, number, object, SchemaOf } from "yup";
import { userFriendlyNumberTypeError } from "../SchemaUtils";
import { PlayerAction, ReqBody } from "./Types";

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
});

export default reqBodySchema;
