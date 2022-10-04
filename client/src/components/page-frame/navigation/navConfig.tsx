import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SearchIcon from "@mui/icons-material/Search";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { AuthStatus } from "../../../queries/user";
import intersection from "lodash/intersection";

export { AuthStatus } from "../../../queries/user";

/**
 * Indicates AuthStatuse query states where an entry in navConfig should be
 * rendered as part of the SiteNavDrawer.
 */
type DisplayOn = {
  /** Listing of AuthStatus values where entry will be rendered. */
  authStatus?: AuthStatus | AuthStatus[];
  /** true when entry will be rendered if AuthStatus query errors */
  authStatusError?: boolean;
  /** true when entry will be rendered if AuthStatus query is pending */
  authStatusPending?: boolean;
};

/**
 * Properties shared by all NavConfigEntries
 */
type NavConfigBaseEntry = {
  /** Name used to display in SiteNavDrawer, title component in AppBar */
  humanName: string;
  /**
   * Optional indication of AuthStatus query states where this entry (and all
   * of its children) should be rendered in the SiteNavDrawer. Leaving this
   * undefined will display this entry in all AuthStatus query states.
   */
  displayOn?: DisplayOn;
};

/**
 * Properties specific to a category.
 */
type NavConfigCategoryEntryProps = {
  /** Child {@linkcode NavConfig} */
  navConfig: NavConfig;
};

/**
 * Properties specific to a link.
 */
type NavConfigLinkEntryProps = {
  /** Optional icon to show next to the link in the SiteNavDrawer */
  icon?: JSX.Element;
  /**
   * Indicator that the link should use a native anchor tag (i.e. <a />) to
   * render instead of the default ReactRouter link.
   */
  nativeLink?: boolean;
};

/**
 * A NavConfig entry
 *   - without link display properties defined by
 *     {@linkcode NavConfigCategoryEntryProps}
 *   - with a child {@linkcode NavConfig}.
 */
export type NavConfigCategoryEntry = NavConfigBaseEntry &
  Partial<Record<keyof NavConfigLinkEntryProps, undefined>> &
  NavConfigCategoryEntryProps;

/**
 * A NavConfig entry
 *  - without a child {@linkcode NavConfig}
 *  - with optional link display properties defined by
 *    {@linkcode NavConfigCategoryEntryProps}
 */
export type NavConfigLinkEntry = NavConfigBaseEntry &
  Partial<Record<keyof NavConfigCategoryEntryProps, undefined>> &
  NavConfigLinkEntryProps;

/**
 * Either a
 *   - category: a {@linkcode NavConfigCategoryEntry}
 *   - link: a {@linkcode NavConfigLinkEntry}
 */
export type NavConfigEntry = NavConfigCategoryEntry | NavConfigLinkEntry;

/**
 * A NavConfig--an object whose keys represent string components of a URL
 * path and whose values are each a {@linkcode NavConfigEntry}.
 */
export type NavConfig = {
  [pathComponent: string]: NavConfigEntry;
};

// Common configuration that is used to:
//  1) Construct the content of the SiteNavDrawer
//  2) Identify the title in the AppBar for some ulrs
const navConfig: NavConfig = {
  rooms: {
    displayOn: { authStatus: AuthStatus.REGISTERED },
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
  account: {
    displayOn: {
      authStatus: [
        AuthStatus.UNAUTHENTICATED,
        AuthStatus.AUTHENTICATED,
        AuthStatus.AUTHORIZED,
        AuthStatus.REGISTERED,
      ],
      authStatusError: true,
    },
    humanName: "Account",
    navConfig: {
      edit: {
        displayOn: {
          authStatus: [AuthStatus.AUTHORIZED, AuthStatus.REGISTERED],
        },
        humanName: "Edit",
        icon: <ManageAccountsIcon />,
      },
      waitlist: {
        displayOn: {
          authStatus: [AuthStatus.AUTHENTICATED],
        },
        humanName: "Waitlist",
        icon: <ReceiptLongIcon />,
      },
      logout: {
        displayOn: {
          authStatus: [
            AuthStatus.AUTHENTICATED,
            AuthStatus.AUTHORIZED,
            AuthStatus.REGISTERED,
          ],
          authStatusError: true,
        },
        nativeLink: true,
        humanName: "Logout",
        icon: <LogoutIcon />,
      },
      login: {
        displayOn: {
          authStatus: AuthStatus.UNAUTHENTICATED,
        },
        nativeLink: true,
        humanName: "Login/Signup",
        icon: <LoginIcon />,
      },
    },
  },
  welcome: {
    humanName: "Welcome",
  },
  about: {
    humanName: "About",
  },
  contact: {
    humanName: "Contact",
  },
};

/**
 * Represents all information for {@linkcode NavConfigEntry} needed for case
 * based testing.
 */
export type FlatNavConfigEntry = {
  /** Display rules for this entry inclusive of ancestors' displayOn */
  effectiveDisplayOn?: DisplayOn;
  /** humanName for this entry */
  humanName: string;
  /** URL path for this entry inclusive of ancestors' pathComponents */
  path: string;
  /** navTitle for this entry inclusive of ancestors' humanNames */
  title: string;
  /** icon for this entry */
  icon?: JSX.Element;
  /** nativeLInk for this entry */
  nativeLink?: boolean;
  /** true when this entry has children in a navConfig */
  hasChildren: boolean;
  /** the humanNames of this entry's ancestors' in order */
  ancestorHumanNames: string[];
};

type HumanNameReducer = (
  humanName?: string,
  reducedHumanName?: string
) => string;
/**
 * Given a human name and the return value of a previous invocation of this
 * function, returns a string where the given human name appears AFTER the
 * previous invocation's return value.
 *
 *
 * @param humanName a human name
 * @param reducedHumanName the return value of a previous invocation of this
 *   function
 * @returns a string where the given human name appears AFTER the
 *   previous invocation's return value
 *
 * @example
 * const reduction = defaultTitleReducer(
 *   "foo",
 *   defaultTitleReducer(
 *     "bar",
 *     defaultTitleReducer("baz")
 *   )
 * );
 * console.log(reduction); // prints "baz bar foo"
 */
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

/**
 * Given an AuthStatus or AuthStatus[], returns an AuthStatus[].
 *
 * @param authStatus an AuthStatus or AuthStatus[]
 * @returns an AuthStatus[]
 */
const authStatusAsArray = (authStatus: NonNullable<DisplayOn["authStatus"]>) =>
  Array.isArray(authStatus) ? authStatus : [authStatus];

/**
 * Given an optional DisplayOn and an optional return value of a previous
 * invocation of this function, returns an optional DisplayOn whose values
 * represent an intersection of the two.
 *
 *
 * @param displayOn an optional DisplayOn
 * @param reducedDisplayOn an optional return value of a previous invocation of
 *   this function
 * @returns an optional DisplayOn whose values represent an intersection of the
 *   two
 */
const displayOnReducer = (
  displayOn?: DisplayOn,
  reducedDisplayOn?: DisplayOn
): DisplayOn | undefined => {
  if (!displayOn || !reducedDisplayOn) {
    return displayOn || reducedDisplayOn;
  }

  const reducedAuthStauts =
    !displayOn.authStatus || !reducedDisplayOn.authStatus
      ? displayOn.authStatus || reducedDisplayOn.authStatus
      : intersection(
          authStatusAsArray(displayOn.authStatus),
          authStatusAsArray(reducedDisplayOn.authStatus)
        );
  const reducedAuthStatusError =
    !!displayOn.authStatusError && !!reducedDisplayOn.authStatusError;

  const reducedAuthStatusPending =
    !!displayOn.authStatusPending && !!reducedDisplayOn.authStatusPending;

  return {
    authStatus: reducedAuthStauts,
    authStatusError: reducedAuthStatusError,
    authStatusPending: reducedAuthStatusPending,
  };
};

type FlattenNavConfigOptions = { titleReducer?: HumanNameReducer };
/**
 * Given a {@linkcode NavConfig}, returns a {@linkcode FlatNavConfigEntry} array
 * for each {@linkcode NavConfigEntry}.
 *
 * @param nc a {@linkcode NavConfig}
 * @param options optional options parameter
 * @param options.titleReducer optional funciton defining how to reduce the
 *   humanNames in any traversal of the navConfig into a single title
 * @returns a {@linkcode FlatNavConfigEntry} array for each
 *   {@linkcode NavConfigEntry}.
 */
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
    const { displayOn, humanName, navConfig, icon, nativeLink } = nce;
    const fncEntries = flattenNavConfigRecursive(navConfig).map(
      ({
        effectiveDisplayOn: childDisplayOn,
        path: childPath,
        title: childTitle,
        ancestorHumanNames,
        ...rest
      }) => ({
        effectiveDisplayOn: displayOnReducer(displayOn, childDisplayOn),
        path: `${path}${childPath}`,
        title: titleReducer(humanName, childTitle),
        ancestorHumanNames: [humanName, ...ancestorHumanNames],
        ...rest,
      })
    );
    const fncEntry: FlatNavConfigEntry = {
      effectiveDisplayOn: displayOn,
      humanName,
      path,
      title: humanName,
      icon,
      nativeLink,
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
