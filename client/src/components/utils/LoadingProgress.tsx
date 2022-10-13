import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import { FC } from "react";

// Delay before progress bar fades in
// (see https://mui.com/material-ui/react-progress/#delaying-appearance)
const transitionInDelayMs = 800;
const transitionOutDelayMs = 0;

export const defaultAriaLabel = "Loading";

type LoadingProgressProps = {
  show: boolean;
  ariaLoadingObjectLabel?: string;
};
/**
 * Given props, returns a progress bar indicating that something is loading.
 * When props.show is true, progress bar fades in after a delay
 * (see https://mui.com/material-ui/react-progress/#delaying-appearance for
 * why).
 *
 * @param props
 * @param props.show boolean indicating whether the progress bar should be
 *   shown; note this occurs after a delay
 * @param props.ariaLoadingObjectLabel the progress bar has a default
 *   aria-label of "Loading"--this prop can be used to extend that description
 *   such that the aria-label will be `Loading ${props.ariaLoadingObjectLabel}`
 * @returns a progress bar indicating that something is loading
 */
const LoadingProgress: FC<LoadingProgressProps> = ({
  show,
  ariaLoadingObjectLabel,
}) => (
  <Fade
    in={show}
    style={{
      transitionDelay: show
        ? `${transitionInDelayMs}ms`
        : `${transitionOutDelayMs}ms`,
    }}
  >
    <LinearProgress
      sx={{
        marginTop: 0.25,
        marginBottom: 0.25,
      }}
      color="secondary"
      aria-label={`${defaultAriaLabel}${
        ariaLoadingObjectLabel ? ` ${ariaLoadingObjectLabel}` : ""
      }`}
    />
  </Fade>
);

export default LoadingProgress;
