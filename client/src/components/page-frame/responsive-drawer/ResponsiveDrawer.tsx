import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { FC, ReactNode } from "react";

type ResponsiveDrawerProps = {
  isOpenForMobile: boolean;
  onCloseForMobile: () => void;
  drawerWidth: number;
  nav: ReactNode;
  settings: ReactNode;
};
/**
 * Given props, returns a responsive drawer containing navigation and settings
 * elements. Responsive means that on mobile screens, drawer's visibility
 * depends on isOpenForMobile prop. Clicking navigation elements on mobile
 * screens triggers close; no such behavior occurs for settings elements.
 *
 * @param props
 * @param props.isOpenForMobile boolean that controls visibility of mobile
 *   drawer children
 * @param props.onCloseForMobile callback repsonsible for handling close of
 *   mobile drawer
 * @param props.drawerWidth the width of the drawer
 * @param props.nav the navigation elements of the drawer (e.g links to
 *   pages within the app) that invoke onCloseForMobile when clicked
 * @param props.settings settings elements of the drawer (e.g. dark mode toggle)
 *   that do not invoke onCloseForMobile when clicked
 * @returns a drawer component containing nav and settings that is reponsive
 */
const ResponsiveDrawer: FC<ResponsiveDrawerProps> = ({
  isOpenForMobile,
  onCloseForMobile,
  drawerWidth,
  nav,
  settings,
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
      <Box width={drawerWidth} role="presentation">
        <Box onClick={onCloseForMobile}>
          <Toolbar />
          {nav}
        </Box>
        <Divider />
        {settings}
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
      {nav}
      <Divider />
      {settings}
    </Drawer>
  </Box>
);

export default ResponsiveDrawer;
