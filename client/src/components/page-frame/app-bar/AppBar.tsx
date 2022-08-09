import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import React, { FC } from "react";
import { NavTitle } from "../navigation";
import pokesterImage from "./pokester.png";

export const menuButtonLabel = "Menu";
export const logoAlt = "Joker Card";

type AppBarProps = { title?: string; onMenuClick: () => void };
/**
 * Given props, returns an AppBar which displays the navConfig based title and
 * a responsive menu button.
 *
 * @param props
 * @param props.title An optional title that replaces the navConfig based title
 * @param props.onMenuClick A callback for when the mobile menu button is
 *   clicked
 * @returns an AppBar which displays the navConfig based title and a responsive
 *   menu button.
 */
const AppBar: FC<AppBarProps> = ({ title, onMenuClick }) => (
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
      <Box mr={1}>
        <img src={pokesterImage} alt={logoAlt} />
      </Box>
      <NavTitle overrideTitle={title} />
    </Toolbar>
  </MuiAppBar>
);

export default AppBar;
