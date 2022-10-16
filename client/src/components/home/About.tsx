import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { FC } from "react";

/**
 * Returns the about section of the homepage.
 *
 * @returns the about section of the homepage.
 */
const About: FC = () => (
  <>
    <Typography variant="h6" component="h2" my={1}>
      About
    </Typography>
    <Typography variant="body1" component="p" my={1}>
      Pokester is a hobby project inspired by{" "}
      <Link href="https://donkhouse.com" target="_blank">
        rounds of poker played online
      </Link>{" "}
      with socially distant friends during the COVID-19 pandemic.
    </Typography>
    <Typography variant="body1" component="p" my={1}>
      As such, it comes with no warranties or guarantees of any kind. By signing
      up for Pokester, you understand Pokester is provided on an as is and as
      avilable basis (i.e. Pokester disclaims responsiblity and liability for
      the availability, timeliness, security, or reliability of the site and can
      modify, suspend, or discontinue site operation at any time with or without
      notice).
    </Typography>
    <Typography variant="body1" component="p" my={1}>
      All that being said, it was{" "}
      <Link href="https://github.com/seanstern/pokester" target="_blank">
        built with care
      </Link>{" "}
      and aims to be
    </Typography>
    <Box component="ul" ml={2}>
      <Box component="li">
        <Link
          href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design"
          target="_blank"
        >
          responsive
        </Link>{" "}
        to different screen sizes
      </Box>
      <Box component="li">
        <Link
          href="https://developer.mozilla.org/en-US/docs/Web/Accessibility"
          target="_blank"
        >
          accessible
        </Link>
      </Box>
      <Box component="li">
        secure--including{" "}
        <Link
          href="https://auth0.com/blog/hashing-passwords-one-way-road-to-security/#Simplifying-Password-Management-with-Auth0"
          target="_blank"
        >
          professional-grade password management
        </Link>{" "}
        and an{" "}
        <Link
          href="https://github.com/seanstern/pokester/blob/main/server/src/views/player-views-of/ViewOfPlayer.ts"
          target="_blank"
        >
          implementation
        </Link>{" "}
        that keeps hole cards private
      </Box>
      <Box component="li">a little bit fun</Box>
    </Box>
  </>
);

export default About;
