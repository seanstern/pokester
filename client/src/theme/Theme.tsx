import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createContext, FC, useContext, useState } from "react";

export enum Mode {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}
/**
 * Given a nullable string, returns true when it is a Mode; false otherwise.
 *
 * @param s a nullable string
 * @returns true when s is a Mode; false otherwise.
 */
const isMode = (s: string | null): s is Mode =>
  Object.values(Mode).includes(s as any);

type ThemeModeContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: Mode.SYSTEM,
  setMode: () => {},
});

const pokesterYellow = "#fdd835";
const pokesterPurple = "#4527a0";
const lsModeKey = "appModePref";
const darkTheme = createTheme({
  palette: {
    mode: Mode.DARK,
    primary: { main: pokesterYellow },
    secondary: { main: pokesterPurple },
  },
});
const lightTheme = createTheme({
  palette: {
    mode: Mode.LIGHT,
    primary: { main: pokesterPurple },
    secondary: { main: pokesterYellow },
  },
});

/**
 * Given props, returns a provider that shares a mode value and setMode function
 * which can be consumed and called using the hooks {@linkcode useThemeMode}.
 *
 * @param props
 * @param props.children the child nodes which will be provided mode and
 *   setMode
 * @returns returns a provider that shares a mode value and setMode function
 *   which can be consumed and called using the hooks {@linkcode useThemeMode}.
 */
export const ThemeProvider: FC = ({ children }) => {
  const browserModePref = useMediaQuery("(prefers-color-scheme: dark)")
    ? Mode.DARK
    : Mode.LIGHT;

  const [appModePref, setAppModePref] = useState(() => {
    const lsAppPreference = localStorage.getItem(lsModeKey);
    return isMode(lsAppPreference) ? lsAppPreference : Mode.SYSTEM;
  });

  const themeMode: Mode.DARK | Mode.LIGHT =
    appModePref === Mode.DARK || appModePref === Mode.LIGHT
      ? appModePref
      : browserModePref;

  const theme = themeMode === Mode.DARK ? darkTheme : lightTheme;

  return (
    <ThemeModeContext.Provider
      value={{
        mode: appModePref,
        setMode: (m: Mode) => {
          if (m === Mode.DARK || m === Mode.LIGHT) {
            localStorage.setItem(lsModeKey, m);
          } else {
            localStorage.removeItem(lsModeKey);
          }
          setAppModePref(m);
        },
      }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};

/**
 * Returns a mode value and a setMode function for controlling the theme mode.
 *
 * @returns a mode value and a setMode function for controlling the theme mode.
 */
export const useThemeMode = () => useContext(ThemeModeContext);
