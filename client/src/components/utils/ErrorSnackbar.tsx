import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { FC, useEffect, useState } from "react";

export const defaultMessage = "Something's gone wrong.";

type ErrorPresentSnackbarProps = {
  show: true;
  message?: string;
};
type ErrorAbsentSnackbarProps = {
  show: false;
};
type ErrorSnackbarProps = ErrorPresentSnackbarProps | ErrorAbsentSnackbarProps;
/**
 * Given props, returns an error alert snackbar.
 *
 * @param props
 * @param props.show boolean indicating whether or not the error alert snackbar
 *   should be shown
 * @param props.message an optional custom error alert message; defaults to
 *   "Something's gone wrong." if nothing is passed.
 * @returns an error alert snackbar
 */
const ErrorSnackbar: FC<ErrorSnackbarProps> = (props) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (props.show) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [props.show]);

  const handleSnackBarOnClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const message = props.show && props.message ? props.message : defaultMessage;

  return (
    <Snackbar
      open={open}
      autoHideDuration={props.show && props.message ? 6000 : undefined}
      onClose={handleSnackBarOnClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="error" onClose={handleSnackBarOnClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
