import { useTheme } from "@mui/material/styles";

/**
 * Returns the color for currency--"darkgreen" in light mode, "lightgreen" in
 * dark mode.
 *
 * @returns the color for currency--"darkgreen" in light mode, "lightgreen" in
 * dark mode
 */
const useCurrencyColor = () => {
  const theme = useTheme();
  return theme.palette.mode === "dark" ? "lightgreen" : "darkgreen";
};

export default useCurrencyColor;
