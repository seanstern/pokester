import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import React, { FC } from "react";

type ResponsiveDrawerProps = {
  isOpenForMobile: boolean;
  onCloseForMobile: () => void;
  drawerWidth: number;
};
/**
 * Given props, returns a drawer component containing children that is
 * responsive. More specifically, on mobile screens, drawer's visibility
 * depends on isOpenForMobile prop.
 *
 * @param props
 * @param props.isOpenForMobile boolean that controls visibility of mobile
 *   drawer children
 * @param props.onCloseForMobile callback repsonsible for handling close of
 *   mobile drawer
 * @param props.drawerWidth the width of the drawer
 * @returns a drawer component containing children that is reponsive
 */
const ResponsiveDrawer: FC<ResponsiveDrawerProps> = ({
  isOpenForMobile,
  onCloseForMobile,
  drawerWidth,
  children,
}) => (
  <Box sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
    <Drawer
      variant="temporary"
      open={isOpenForMobile}
      onClose={onCloseForMobile}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
    >
      <Box
        sx={{
          width: drawerWidth,
        }}
        role="presentation"
        onClick={onCloseForMobile}
      >
        <Toolbar />
        {children}
      </Box>
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
      open
    >
      <Toolbar />
      {children}
    </Drawer>
  </Box>
);

export default ResponsiveDrawer;
