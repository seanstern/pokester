import SearchIcon from "@mui/icons-material/Search";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import React from "react";

export type NavConfigEntry = {
  humanName: string;
  icon?: JSX.Element;
  navConfig?: NavConfig;
};

export type NavConfig = {
  [pathComponent: string]: NavConfigEntry;
};

// Common configuration that is used to:
//  1) Construct the content of the SiteNavDrawer
//  2) Identify the title in the AppBar for some ulrs
const navConfig: NavConfig = {
  rooms: {
    humanName: "Rooms",
    navConfig: {
      browse: {
        humanName: "Browse",
        icon: <SearchIcon />,
      },
      create: {
        humanName: "Create",
        icon: <TableRestaurantIcon />,
      },
    },
  },
};

type FlatNavConfigEntry = {
  path: string;
  humanName: string;
  icon?: JSX.Element;
};

type HumanNameReducer = (
  humanName?: string,
  reducedHumanName?: string
) => string;

export const defaultHumanNameReducer: HumanNameReducer = (
  humanName?,
  reducedHumanName?
) =>
  !humanName && !reducedHumanName
    ? ""
    : !humanName
    ? reducedHumanName || ""
    : !reducedHumanName
    ? humanName || ""
    : `${reducedHumanName} ${humanName}`;

type FlattenNavConfigOptions = { humanNameReducer?: HumanNameReducer };

const flattenNavConfig = (
  nc?: NavConfig,
  options?: FlattenNavConfigOptions
): FlatNavConfigEntry[] => {
  const humanNameReducer = options?.humanNameReducer || defaultHumanNameReducer;

  const flattenNavConfigEntryRecursive = ([pathComponent, nce]: [
    string,
    NavConfigEntry
  ]): FlatNavConfigEntry[] => {
    const path = `/${pathComponent}`;
    const { humanName, icon, navConfig } = nce;
    const fncEntry = { path, humanName, icon };
    const fncEntries = flattenNavConfigRecursive(navConfig).map(
      ({ path: childPath, humanName: childHumanName, ...rest }) => ({
        path: `${path}${childPath}`,
        humanName: humanNameReducer(humanName, childHumanName),
        ...rest,
      })
    );
    return [fncEntry, ...fncEntries];
  };

  const flattenNavConfigRecursive = (nc?: NavConfig): FlatNavConfigEntry[] => {
    if (!nc) return [];
    return Object.entries(nc).flatMap((entry) =>
      flattenNavConfigEntryRecursive(entry)
    );
  };

  return flattenNavConfigRecursive(nc);
};

export const flatNavConfig = flattenNavConfig(navConfig);

export default navConfig;
