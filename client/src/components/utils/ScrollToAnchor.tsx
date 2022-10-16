import Box from "@mui/material/Box";
import { FC, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const scrollMarginTop = 88;

type ScrollToAnchor = {
  id: string;
};
/**
 * Given an props, returns a component that scrolls into view when the URI
 * @param param0
 * @returns
 */
const ScrollExp: FC<ScrollToAnchor> = ({ id, children }) => {
  const { hash } = useLocation();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (`#${id}` === hash) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [id, hash]);

  return (
    <Box ref={ref} sx={{ scrollMarginTop }}>
      {children}
    </Box>
  );
};

export default ScrollExp;
