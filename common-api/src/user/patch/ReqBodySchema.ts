import { string, object, SchemaOf } from "yup";
import { ReqBody } from "./Types";

export const usernameLabel = "username";

const reqBodySchema: SchemaOf<ReqBody> = object({
  username: string()
    .label(usernameLabel)
    .min(3)
    .max(40)
    .matches(/^[A-Za-z0-9]*$/, "${path} must contain only alphanumeric chars"),
});

export default reqBodySchema;
