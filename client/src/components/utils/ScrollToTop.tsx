import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Returns a component that moves the scroll to the top of the page upon
 * pathname change
 * @see https://v5.reactrouter.com/web/guides/scroll-restoration
 *
 * @returns a component that moves the scroll to the top of the page upon
 * pathname change
 */
const ScrollToTop: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
