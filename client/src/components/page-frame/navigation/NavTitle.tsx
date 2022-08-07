import Typography from "@mui/material/Typography";
import React, { FC } from "react";
import useSiteNavTitle from "./useNavTitle";

export const defaultTitle = "Pokester";

type NavTitleProps = {
  overrideTitle?: string;
  exact?: boolean;
};
/**
 * Returns a title for the page based on the current URL path and the humanNames
 * specified in the navConfig. If the current URL path does not have a match in
 * the navConfig, a default title ("Pokester") is utilized.
 *
 * @param props
 * @param props.overrideTitle an optional title to use insetead of the navConfig
 *   based title
 * @param props.exact an optional boolean indicating the correspondence requried
 *   between the URL path and the navConfig in order to utilize a navConfig
 *   based title; when true, a navConfig based title is returned only for URL
 *   paths that terminate in a node in the navConfig tree (i.e. a path that
 *   extends beyond the tree will return utilize the defaultTitle); when false,
 *   a title is utilized when the URL path traverses any part of the navConfig
 *   tree; defaults to true
 *
 * @returns a title for the page based on the current URL path and the
 *   humanNames specified in the navConfig.
 */
const NavTitle: FC<NavTitleProps> = ({ overrideTitle, exact }) => {
  const siteNavTitle = useSiteNavTitle({ defaultTitle, exact });
  return (
    <Typography variant="h6" component="h1" noWrap>
      {overrideTitle || siteNavTitle}
    </Typography>
  );
};

export default NavTitle;
