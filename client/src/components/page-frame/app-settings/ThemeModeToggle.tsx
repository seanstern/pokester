import Brightness5Icon from "@mui/icons-material/Brightness5";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { FC } from "react";
import { Mode, useThemeMode } from "../../../theme";

const labelId = "theme-mode-toggle";
export const label = "Mode";

/**
 * Returns a toggle button group that controls the theme mode.
 *
 * @returns a toggle button group that controls the theme mode.
 */
const ThemeToggle: FC = () => {
  const { mode, setMode } = useThemeMode();
  return (
    <Box>
      <Typography variant="caption" component="p" id={labelId}>
        {label}
      </Typography>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, v: Mode | null) => {
          if (v) {
            setMode(v);
          }
        }}
        aria-labelledby={labelId}
      >
        <ToggleButton
          value={Mode.DARK}
          aria-label={Mode.DARK}
          color="secondary"
        >
          <DarkModeIcon />
        </ToggleButton>
        <ToggleButton value={Mode.SYSTEM} aria-label={Mode.SYSTEM}>
          <SettingsBrightnessIcon />
        </ToggleButton>
        <ToggleButton
          value={Mode.LIGHT}
          aria-label={Mode.LIGHT}
          color="secondary"
        >
          <Brightness5Icon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ThemeToggle;
