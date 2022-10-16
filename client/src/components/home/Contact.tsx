import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { FC, useCallback, useEffect, useState } from "react";
import { scrollMarginTop } from "../utils/ScrollToAnchor";

const contactEmail = "contact@playpokester.com";
const sourceLabel = "github";

/**
 * Returns the contact seciton of the home page.
 *
 * @returns the contact section of the home page.
 */
const Contact: FC = () => {
  const [windowInnerHeight, setWindowInnerHeight] = useState(
    window.innerHeight
  );
  const onResize = useCallback<EventListener>(
    () => setWindowInnerHeight(window.innerHeight),
    [setWindowInnerHeight]
  );
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  return (
    <Box textAlign="right" minHeight={windowInnerHeight - scrollMarginTop}>
      <Typography variant="h6" component="h2" my={1}>
        Contact
      </Typography>
      <Typography variant="body1" component="p">
        <IconButton
          aria-label={contactEmail}
          href={`mailto:${contactEmail}`}
          color="primary"
          size="small"
        >
          <EmailIcon />
        </IconButton>
        {contactEmail}
      </Typography>
      <Typography variant="body1" component="p">
        <IconButton
          aria-label={sourceLabel}
          href="https://github.com/seanstern/pokester/"
          target="_blank"
          color="primary"
          size="small"
        >
          <GitHubIcon />
        </IconButton>
        {sourceLabel}
      </Typography>
    </Box>
  );
};

export default Contact;
