export enum RegistrationStep {
  USERNAME_SELECTION = "username selection",
  EMAIL_VERIFICATION = "email verification",
}

export type ResBody = {
  username?: string;
  email?: {
    address: string;
    verified: boolean;
  };
  incompleteRegistration?: RegistrationStep[];
};
