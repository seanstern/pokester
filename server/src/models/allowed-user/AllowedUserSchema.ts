import { Schema } from "mongoose";

/**
 * The public interface for an AllowedUser Document. Used as an allow list
 * for accessing the API.
 */
export type AllowedUserDoc = {
  email?: string;
};

const defaultCollation = { locale: "en", strength: 2 };

const AllowedUserSchema = new Schema<AllowedUserDoc>(
  {
    email: {
      type: String,
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
    collation: defaultCollation,
  }
);

AllowedUserSchema.index(
  { email: 1 },
  {
    name: "email_1_collation_en_2",
    unique: true,
    collation: defaultCollation,
  }
);

export default AllowedUserSchema;
