import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import React, { FC } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import navConfig, { NavConfigEntry } from "./navConfig";

type NavMenuLinkProps = {
  parentPath: string;
  pathComponent: string;
} & Exclude<NavConfigEntry, "navConfig">;
/**
 * Given props, returns a navigation menu link.
 *
 * @param props
 * @param props.parentPath a prefix to appended to the URL path of this
 *   navigation menu link (i.e. this menu link will have an href
 *   of the form `${parentPath}/${pathComponent}`)
 * @param props.pathComponent a suffix to append to the URL path of this
 *   navigation menu link (i.e. this menu link will have an href
 *   of the form `${parentPath}/${pathComponent}`)
 * @param props.humanName the display text of the link
 * @param props.icon an optional icon to display next to the link
 * @returns a navigation menu link
 */
const NavMenuLink: FC<NavMenuLinkProps> = ({
  parentPath,
  pathComponent,
  humanName,
  icon,
}) => {
  const path = `${parentPath}/${pathComponent}`;
  const match = useRouteMatch(path);
  return (
    <ListItemButton selected={!!match} component={Link} to={path}>
      {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText inset={!icon} primary={humanName} />
    </ListItemButton>
  );
};

type NavMenuCategoryProps = {
  pathComponent: string;
} & Exclude<NavConfigEntry, "icon">;
/**
 * Given props, returns a navigation menu category (i.e. a named list of
 * related navigation menu links).
 *
 * @param props
 * @param props.pathComponent a prefix to appended to the URL path of all
 *   navigation menu links (i.e. each navigatin menu link will have an href
 *   of the form `/${pathComponent}/${navigationMenuLinkSpecificSubpath}`)
 * @param props.humanName the name of the navigation menu category
 * @returns a navigation menu category (i.e. a named list of related
 *   navigation menu links)
 */
const NavMenuCategory: FC<NavMenuCategoryProps> = ({
  pathComponent,
  humanName,
  navConfig,
}) => {
  const listSubheaderId = `site-nav-category-${pathComponent}`;
  return (
    <>
      <List
        aria-labelledby={listSubheaderId}
        subheader={
          <ListSubheader id={listSubheaderId}>{humanName}</ListSubheader>
        }
      >
        {Object.entries(navConfig || {}).map(([linkPathComponent, data]) => (
          <NavMenuLink
            key={linkPathComponent}
            pathComponent={linkPathComponent}
            parentPath={`/${pathComponent}`}
            {...data}
          />
        ))}
      </List>
      <Divider />
    </>
  );
};

export const navMenuLabel = "Navigation Menu";
/**
 * Returns a menu for navigating the site with entries based on the navConfig.
 *
 * @returns a menu for navigating the site with entries based on the navConfig.
 */
const NavMenu: FC = () => (
  <Box component="nav" aria-label={navMenuLabel}>
    {Object.entries(navConfig).map(([pathComponent, data]) => (
      <NavMenuCategory
        key={pathComponent}
        pathComponent={pathComponent}
        {...data}
      />
    ))}
  </Box>
);

export default NavMenu;
