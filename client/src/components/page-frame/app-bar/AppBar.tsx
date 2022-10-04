import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { FC } from "react";
import pokesterImage from "./pokester.png";

export const menuButtonLabel = "Menu";
export const logoAlt = "Joker Card";
export const showSiteNameBreakPoint = "sm";

/**
 * Given a boolean indicating whether or not the site name should be shown
 * and a page title, returns a string that serves as the heading for the
 * AppBar.
 *
 * @param showSiteName boolean indicating whether or not the site name should
 *   be shown.
 * @param title a page specific title string.
 * @returns  a string that serves as the heading for the AppBar.
 */
export const getHeading = (showSiteName: boolean, title: string) =>
  [
    showSiteName ? "Pokester" : "",
    showSiteName && title ? " " : "",
    title ? "/ " : "",
    title,
  ].join("");

type AppBarProps = { title: string; onMenuClick: () => void };
/**
 * Given props, returns an AppBar which displays the title and a responsive
 * menu button.
 *
 * @param props
 * @param props.title a title
 * @param props.onMenuClick A callback for when the mobile menu button is
 *   clicked
 * @returns an AppBar which displays a title and a responsive menu button.
 */
const AppBar: FC<AppBarProps> = ({ title, onMenuClick }) => {
  const theme = useTheme();
  const showSiteName = useMediaQuery(
    theme.breakpoints.up(showSiteNameBreakPoint)
  );
  return (
    <MuiAppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label={menuButtonLabel}
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box mr={{ xs: 0.5, sm: 1 }}>
          <img src={pokesterImage} alt={logoAlt} />
        </Box>
        <Typography variant="h6" component="h1" noWrap>
          {getHeading(showSiteName, title)}
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
