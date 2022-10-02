import { Schema } from "mongoose";

/**
 * The public interface for an User Document.
 */
export type UserDoc = {
  /**
   * The identifying information from an OpenID token. Includes BOTH issuer
   * and subject for holistic indentification and to allow for transition to
   * alterntive issuer (i.e. not auth0) in the future if desired.
   */
  oidc?: {
    iss?: string;
    sub?: string;
  };
  /** The unique, public id for a user of the pokester API. */
  username?: string;
};

const UserSchema = new Schema<UserDoc>(
  {
    oidc: {
      iss: {
        type: String,
        required: true,
        immutable: true,
      },
      sub: {
        type: String,
        required: true,
        immutable: true,
      },
    },
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ "oidc.iss": 1, "oidc.sub": 1 }, { unique: true });

export default UserSchema;
