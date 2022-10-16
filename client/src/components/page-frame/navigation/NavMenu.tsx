import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { FC } from "react";
import { Link, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import {
  AuthStatusQuery,
  isAuthStatusError,
  isAuthStatusPending,
  isAuthStatusResult,
  useAuthStatus,
} from "../../../queries/user";
import navConfig, {
  NavConfig,
  NavConfigCategoryEntry,
  NavConfigEntry,
  NavConfigLinkEntry,
} from "./navConfig";

/**
 * Given an auth status query and a rule for when a nav config entry should
 * be displayed, returns true if the auth status query meets the rule's
 * requirements (and should be displayed); false otherwise.
 *
 * @param authStatusQuery query represeting the user's auth status
 * @param displayOn rule that indicates when a nav config entry should be
 *   displayed
 * @returns true when the auth status query meets the rule's requirements
 */
export const display = (
  authStatusQuery: AuthStatusQuery,
  displayOn?: NavConfigEntry["displayOn"]
) => {
  if (!displayOn) {
    return true;
  }

  if (displayOn.authStatusError && isAuthStatusError(authStatusQuery)) {
    return true;
  }

  if (displayOn.authStatusPending && isAuthStatusPending(authStatusQuery)) {
    return true;
  }

  const displayOnAuthStatus = Array.isArray(displayOn.authStatus)
    ? displayOn.authStatus
    : !!displayOn.authStatus
    ? [displayOn.authStatus]
    : [];
  if (
    isAuthStatusResult(authStatusQuery) &&
    displayOnAuthStatus.includes(authStatusQuery.data)
  ) {
    return true;
  }

  return false;
};

/**
 * Given an optional parent path and a child path component, returns a fully
 * qualified path with the parent path prepended to the child path component.
 *
 * @param parentPath optional parent path
 * @param childPathComponent a child path component
 * @returns a fully qualified path with the parent path prepended to the child
 *  path component.
 */
const getPath = (parentPath: string | undefined, childPathComponent: string) =>
  `${parentPath ? parentPath : ""}/${childPathComponent}`;

type NavMenuLinkProps = {
  parentPath?: string;
  pathComponent: string;
  navConfigLinkEntry: NavConfigLinkEntry;
};
/**
 * Given props, returns a navigation menu link.
 *
 * @param props
 * @param props.parentPath optional prefix that will be prepend to the
 *   pathComponent to form a fully qualified URL path for the link
 * @param props.pathComponent relative path of this link
 * @param props.navConfigLinkEntry link properties of the navConfigEntry
 *
 * @returns a navigation menu link
 */
const NavMenuLink: FC<NavMenuLinkProps> = ({
  parentPath,
  pathComponent,
  navConfigLinkEntry,
}) => {
  const isId = pathComponent.startsWith("#");
  const matchPath = getPath(parentPath, isId ? "" : pathComponent);
  const path = getPath(parentPath, pathComponent);
  const match = useRouteMatch(matchPath);
  const { hash } = useLocation();
  const history = useHistory();
  const selected = !!match && (!isId || (isId && hash === pathComponent));

  const { nativeLink, icon, humanName } = navConfigLinkEntry;

  const listItemLinkProps = nativeLink
    ? { component: "a", href: path }
    : isId
    ? {
        component: Link,
        to: path,
        onClick: () => {
          if (selected) {
            // clear and then reset the id component of the URL to trigger
            // scrollTo behavior when link that is identical to current id is
            // clicked
            (async () => {
              await new Promise((res) => setTimeout(res, 1));
              history.replace(matchPath);
              await new Promise((res) => setTimeout(res, 1));
              history.replace(path);
            })().catch();
          }
        },
      }
    : { component: Link, to: path };

  return (
    <ListItemButton selected={selected} {...listItemLinkProps}>
      {!!icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText inset={!icon && !!parentPath} primary={humanName} />
    </ListItemButton>
  );
};

type NavMenuCategoryProps = {
  parentPath?: string;
  pathComponent: string;
  authStatusQuery: AuthStatusQuery;
  navConfigCategoryEntry: NavConfigCategoryEntry;
};
/**
 * Given props, returns a navigation menu category (i.e. a named list of
 * related navigation menu links).
 *
 * @param props
 * @param props.parentPath optional prefix that will be prepend to the
 *   pathComponent to form a fully qualified URL path for the category
 * @param props.pathComponent relative path of this category
 * @param props.authStatusQuery the auth status of the user
 * @param props.navConfigCategoryEntry category properties of the navConfigEntry
 * @returns a navigation menu category (i.e. a named list of related
 *   navigation menu links)
 */
const NavMenuCategory: FC<NavMenuCategoryProps> = ({
  parentPath,
  pathComponent,
  authStatusQuery,
  navConfigCategoryEntry,
}) => {
  const path = getPath(parentPath, pathComponent);
  const listSubheaderId = `site-nav-category-${path}`;
  const { humanName, navConfig } = navConfigCategoryEntry;
  return (
    <>
      <List
        aria-labelledby={listSubheaderId}
        subheader={
          <ListSubheader id={listSubheaderId}>{humanName}</ListSubheader>
        }
      >
        <NavMenuEntries
          parentPath={path}
          authStatusQuery={authStatusQuery}
          navConfig={navConfig}
        />
      </List>
      <Divider />
    </>
  );
};

type NavMenuEntryProps = {
  parentPath?: string;
  pathComponent: string;
  authStatusQuery: AuthStatusQuery;
  navConfigEntry: NavConfigEntry;
};
/**
 * Given props, returns a navigation menu entry--which will be one of
 *  - null when navConfigEntry.displayOn indicates it should
 *    not be displayed
 *  - a {@linkcode NavMenuLink} when navConfigEntry doesn't have a child
 *    navConfig
 *  - a {@linkcode NavMenuCategory} when navConfigEntry does have a child
 *    navConfig
 *
 * @param props
 * @param props.parentPath optional prefix that will be prepend to the
 *   pathComponent to form a fully qualified URL path for the entry
 * @param props.pathComponent relative path of this entry
 * @param props.authStatusQuery the auth status of the user
 * @param props.navConfigEntry properties of the entry
 * @returns a navigation menu entry--which will be one of
 *  - null when navConfigEntry.displayOn indicates it should
 *    not be displayed
 *  - a {@linkcode NavMenuLink} when navConfigEntry doesn't have a child
 *    navConfig
 *  - a {@linkcode NavMenuCategory} when navConfigEntry does have a child
 *    navConfig
 */
const NavMenuEntry: FC<NavMenuEntryProps> = ({
  parentPath,
  pathComponent,
  authStatusQuery,
  navConfigEntry,
}) => {
  if (!display(authStatusQuery, navConfigEntry.displayOn)) {
    return null;
  }
  if (!navConfigEntry.navConfig) {
    return (
      <NavMenuLink
        parentPath={parentPath}
        pathComponent={pathComponent}
        navConfigLinkEntry={navConfigEntry}
      />
    );
  }
  return (
    <NavMenuCategory
      parentPath={parentPath}
      pathComponent={pathComponent}
      authStatusQuery={authStatusQuery}
      navConfigCategoryEntry={navConfigEntry}
    />
  );
};

type NavMenuEntriesProps = {
  parentPath?: string;
  authStatusQuery: AuthStatusQuery;
  navConfig: NavConfig;
};
/**
 * Given props, returns a {@linkcode NavMenuEntry} list
 *
 * @param props
 * @param props.parentPath optional prefix that will be prepend to each
 *   {@linkcode NavMenuEntry} element to form a fully qualified URL path for
 *   the entry
 * @param props.authStatusQuery the auth status of the user
 * @param props.navConig a navConfig containing one or more entries
 */
const NavMenuEntries: FC<NavMenuEntriesProps> = ({
  parentPath,
  authStatusQuery,
  navConfig,
}) => {
  return (
    <>
      {Object.entries(navConfig).map(([pathComponent, navConfigEntry]) => (
        <NavMenuEntry
          key={pathComponent}
          parentPath={parentPath}
          pathComponent={pathComponent}
          authStatusQuery={authStatusQuery}
          navConfigEntry={navConfigEntry}
        />
      ))}
    </>
  );
};

export const navMenuLabel = "Navigation Menu";
/**
 * Returns a menu for navigating the site with entries based on the navConfig.
 *
 * @returns a menu for navigating the site with entries based on the navConfig.
 */
const NavMenu: FC = () => {
  const authStatusQuery = useAuthStatus();

  return (
    <Box component="nav" aria-label={navMenuLabel}>
      <NavMenuEntries authStatusQuery={authStatusQuery} navConfig={navConfig} />
    </Box>
  );
};

export default NavMenu;
