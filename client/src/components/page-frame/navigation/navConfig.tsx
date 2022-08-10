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

export type FlatNavConfigEntry = {
  humanName: string;
  icon?: JSX.Element;
  path: string;
  title: string;
  hasChildren: boolean;
  ancestorHumanNames: string[];
};

type HumanNameReducer = (
  humanName?: string,
  reducedHumanName?: string
) => string;

export const defaultTitleReducer: HumanNameReducer = (
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

type FlattenNavConfigOptions = { titleReducer?: HumanNameReducer };

const flattenNavConfig = (
  nc?: NavConfig,
  options?: FlattenNavConfigOptions
): FlatNavConfigEntry[] => {
  const titleReducer = options?.titleReducer || defaultTitleReducer;

  const flattenNavConfigEntryRecursive = ([pathComponent, nce]: [
    string,
    NavConfigEntry
  ]): FlatNavConfigEntry[] => {
    const path = `/${pathComponent}`;
    const { humanName, icon, navConfig } = nce;
    const fncEntries = flattenNavConfigRecursive(navConfig).map(
      ({
        path: childPath,
        title: childTitle,
        ancestorHumanNames,
        ...rest
      }) => ({
        path: `${path}${childPath}`,
        title: titleReducer(humanName, childTitle),
        ancestorHumanNames: [humanName, ...ancestorHumanNames],
        ...rest,
      })
    );
    const fncEntry = {
      path,
      humanName,
      icon,
      title: humanName,
      hasChildren: fncEntries.length > 0,
      ancestorHumanNames: [],
    };
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