import { Schema } from "mongoose";

/**
 * The public interface for an AllowedUser Document. Used as an allow list
 * for accessing the API.
 */
export type AllowedUserDoc = {
  email?: string;
};

const AllowedUserSchema = new Schema<AllowedUserDoc>(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

export default AllowedUserSchema;
