import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { FC, useState } from "react";
import AppBar from "./app-bar";
import AppSettings from "./app-settings";
import { NavMenu } from "./navigation";
import { PageTitleProvider, usePageTitle } from "./page-title";
import ResponsiveDrawer from "./responsive-drawer";

const drawerWidth = 200;
/**
 * Given props, returns a page frame--that is, an app bar, navigation menu, and
 * app settings--which frames all child nodes/page content. Exists as a
 * component separate from {@linkcode PageFrame} so {@linkcode usePageTitle}
 * hook can be called inside of {@linkcode PageTitleProvider}.
 *
 * @param props
 * @param props.children the child nodes representing the page content inside
 *   the frame
 * @returns the child nodes representing the content framed by an app bar and
 *   navigation menu
 */
const InnerPageFrame: FC = ({ children }) => {
  const pageTitle = usePageTitle();

  const [isOpenForMobile, setOpenForMobile] = useState(false);

  const toggleIsOpenForMobile = () =>
    setOpenForMobile((isOpenForMobile) => !isOpenForMobile);

  const closeForMobile = () => setOpenForMobile(false);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar onMenuClick={toggleIsOpenForMobile} title={pageTitle} />
      <ResponsiveDrawer
        isOpenForMobile={isOpenForMobile}
        onCloseForMobile={closeForMobile}
        drawerWidth={drawerWidth}
        nav={<NavMenu />}
        settings={<AppSettings />}
      />
      <Box
        component="main"
        flexGrow={1}
        px={3}
        pt={3}
        width={{ xs: 1, md: `calc(100% - ${drawerWidth}px)` }}
        maxWidth="lg"
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

/**
 * Given props, returns a page frame--that is an app bar, navigation menu, and
 * app settings--which frames all child nodes/page content.
 *
 * @param props
 * @param props.children the child nodes representing the page content inside
 *   the frame
 * @returns the child nodes representing the content framed by an app bar and
 *   navigation menu
 */
const PageFrame: FC = ({ children }) => (
  <PageTitleProvider>
    <InnerPageFrame>{children}</InnerPageFrame>
  </PageTitleProvider>
);

export default PageFrame;
