import { yupResolver } from "@hookform/resolvers/yup";
import GppGoodIcon from "@mui/icons-material/GppGood";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { User } from "@pokester/common-api";
import startCase from "lodash/startCase";
import { FC, ReactNode, useEffect } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useGet, usePatch } from "../../queries/user";
import getBadRequestErrorMessage from "../../utils/getBadRequestErrorMessage";
import getTextFieldErrorInfoProps from "../form-utils/getTextFieldErrorInfoProps";
import ErrorSnackbar from "../utils/ErrorSnackbar";
import LoadingProgress from "../utils/LoadingProgress";

const { usernameLabel: rawUsernameLabel, default: reqBodySchema } =
  User.Patch.ReqBodySchema;

export const emailLabel = "Email";
export const emailVerifiedHelperText = "Verified";
export const emailUnverifiedHelperText = "Unverified";
export const usernameLabel = startCase(rawUsernameLabel);
export const saveLabel = "Save";
export const resetFormLabel = "Cancel";
export const emailVerificationMessageLinkLabel = "login again";
export const emailVerificationMessageLinkTo = "/account/login";
export const usernameSelectionMessage = "pick a username";
export const alertTitle = "Before you can play...";

const incompleteRegistrationMessage: Readonly<
  Record<User.Get.RegistrationStep, ReactNode>
> = {
  [User.Get.RegistrationStep.EMAIL_VERIFICATION]: (
    <>
      click the verification link that was sent to your email, and then{" "}
      <Box
        component="a"
        href={emailVerificationMessageLinkTo}
        sx={{ fontWeight: "bold" }}
      >
        {emailVerificationMessageLinkLabel}
      </Box>
      .
    </>
  ),
  [User.Get.RegistrationStep.USERNAME_SELECTION]: (
    <>{usernameSelectionMessage}</>
  ),
};

/**
 * Returns the page containg a form for editing a user account.
 *
 * @returns the page containing a form for create a new room.
 */
const AccountEditor: FC = () => {
  const userQuery = useGet();
  const patch = usePatch();
  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors, isValid, isDirty },
  } = useForm({
    mode: "onTouched",
    defaultValues: { username: userQuery.data?.username || "" },
    resolver: yupResolver(reqBodySchema) as Resolver<User.Patch.ReqBody>,
  });

  const resetForm = () => reset({ username: userQuery.data?.username || "" });

  useEffect(resetForm, [reset, userQuery.data?.username]);

  const queryOrMutationInProgress = userQuery.isFetching || patch.isLoading;
  const isQueryOrMutationError = userQuery.isError || patch.isError;

  const onSubmit = async (patchReqBody: User.Patch.ReqBody) => {
    try {
      await patch.mutateAsync(patchReqBody);
    } catch (err) {
      resetForm();
    }
  };

  const disableSubmitButton =
    !isDirty ||
    userQuery.isLoading ||
    isSubmitting ||
    (Object.keys(errors).length > 0 && !isValid);

  const disableInput = userQuery.isLoading || isSubmitting;

  const emailTextFieldStyleProps = !userQuery.data
    ? {
        error: false,
        adornmentIcon: <GppMaybeIcon />,
        helperText: " ",
      }
    : userQuery.data.email?.verified
    ? {
        error: false,
        adornmentIcon: <GppGoodIcon color="success" />,
        helperText: emailVerifiedHelperText,
      }
    : {
        error: true,
        adornmentIcon: <GppMaybeIcon color="error" />,
        helperText: emailUnverifiedHelperText,
      };

  return (
    <>
      <ErrorSnackbar
        show={isQueryOrMutationError && !queryOrMutationInProgress}
        message={getBadRequestErrorMessage(patch.error)}
      ></ErrorSnackbar>
      <LoadingProgress show={queryOrMutationInProgress} />
      <Collapse in={!!userQuery.data?.incompleteRegistration}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>{alertTitle}</AlertTitle>
          <Box component="ul" ml={2}>
            {userQuery.data?.incompleteRegistration?.map((rs) => (
              <Box component="li" key={rs}>
                {incompleteRegistrationMessage[rs]}
              </Box>
            ))}
          </Box>
        </Alert>
      </Collapse>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          alignItems="stretch"
          sx={{ width: { xs: 1, md: 2 / 3 } }}
          spacing={1}
        >
          <TextField
            error={emailTextFieldStyleProps.error}
            disabled={disableInput}
            id="email"
            label={emailLabel}
            variant="filled"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  {emailTextFieldStyleProps.adornmentIcon}
                </InputAdornment>
              ),
            }}
            helperText={emailTextFieldStyleProps.helperText}
            value={userQuery.data?.email?.address || ""}
          />
          <Controller
            control={control}
            name="username"
            render={({
              field: { ref, ...fieldSansRef },
              fieldState: { error },
              formState: { isValid },
            }) => {
              return (
                <TextField
                  disabled={disableInput}
                  id={fieldSansRef.name}
                  label={usernameLabel}
                  variant="filled"
                  required
                  {...getTextFieldErrorInfoProps(isValid, error)}
                  inputRef={ref}
                  {...fieldSansRef}
                />
              );
            }}
          />
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={disableSubmitButton}
            >
              {saveLabel}
            </Button>
            <Button disabled={disableSubmitButton} onClick={resetForm}>
              {resetFormLabel}
            </Button>
          </Box>
        </Stack>
      </form>
    </>
  );
};

export default AccountEditor;
