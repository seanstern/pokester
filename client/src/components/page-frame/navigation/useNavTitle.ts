import { useLocation } from "react-router-dom";
import navConfig, {
  defaultTitleReducer,
  NavConfig,
  NavConfigEntry,
} from "./navConfig";

/**
 * Given a url path, returns the appropriate navConfig based title for the
 * path. The appropriate title is determined by traversing the navConfig
 * tree (using each component of the pathvas separated by "/" characters) and
 * accumulating humanNames along the traversal.
 *
 * If no part of the navConfig is traversed by the path, undefined is returned.
 *
 * When exact is true, a title is returned only for paths that terminate in a
 * node on the navConfig tree (i.e. a path that extends beyond the tree will
 * return undefined).
 *
 *
 * @param pathname a url path
 * @param exact a boolean indicating the correspondence requried between the
 *   pathname and the navConfig tree in order to return a defined title; when
 *   true, a title is returned only for pathnames that terminate in a node in
 *   the navConfig tree (i.e. a path that extends beyond the tree will return
 *   undefined); when false, a title is returned when the pathname traverses
 *   any part of the navConfig tree
 * @returns a title based on the humanNames in the navConfig
 */
export const getNavTitle = (pathname: string, exact: boolean) => {
  const getTitleFromNavConfigRecursive = (
    pathComponents: string[],
    nc?: NavConfig
  ): string | undefined => {
    if (!nc) return undefined;
    if (pathComponents.length === 0) {
      return undefined;
    }
    const [pathComponent, ...restOfPathComponents] = pathComponents;
    const nce = nc[pathComponent] as NavConfigEntry | undefined;
    const navConfigEntryTitle = getTitleFromNavConfigEntryRecursive(
      restOfPathComponents,
      nce
    );
    return navConfigEntryTitle;
  };

  const getTitleFromNavConfigEntryRecursive = (
    pathComponents: string[],
    nce?: NavConfigEntry
  ): string | undefined => {
    if (!nce) {
      return undefined;
    }
    if (pathComponents.length === 0) {
      return nce.humanName;
    }
    const navConfigTitle = getTitleFromNavConfigRecursive(
      pathComponents,
      nce.navConfig
    );
    if (exact && !navConfigTitle) return undefined;
    return defaultTitleReducer(nce.humanName, navConfigTitle);
  };

  const pathComponents = pathname
    .split("/")
    .filter((pathComponent) => pathComponent !== "");
  const navConfigTitle = getTitleFromNavConfigRecursive(
    pathComponents,
    navConfig
  );
  return navConfigTitle;
};

type UseSiteNavTitleOptions = {
  exact?: boolean;
};
const defaultUseSiteNavNameOptions: UseSiteNavTitleOptions = {
  exact: true,
};
/**
 * Returns the appropriate navConfig based title for the current location's
 * path. The appropriate title is determined by traversing the navConfig
 * tree (using each component of the pathvas separated by "/" characters) and
 * accumulating humanNames along the traversal.
 *
 * @param options
 * @param options.exact optional boolean indicating the correspondence requried
 *   between the pathname and the navConfig tree in order to return a defined
 *   title; when true, a title is returned only for pathnames that terminate in
 *   a node in the navConfig tree (i.e. a path that extends beyond the tree
 *   will return undefined); when false, a title is returned when the pathname
 *   traverses any part of the navConfig tree; defaults to true
 * @returns a human readable title based on the names listed in the navConfig
 */
const useNavTitle = ({
  exact = true,
}: UseSiteNavTitleOptions | undefined = defaultUseSiteNavNameOptions) => {
  const { pathname } = useLocation();
  return getNavTitle(pathname, exact);
};

export default useNavTitle;
