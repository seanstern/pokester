import Box from "@mui/material/Box";
import { FC } from "react";
import ThemeModeToggle from "./ThemeModeToggle";

/**
 * Returns application settings.
 *
 * @returns application settings.
 */
const AppSettings: FC = () => (
  <Box p={2}>
    <ThemeModeToggle />
  </Box>
);

export default AppSettings;
