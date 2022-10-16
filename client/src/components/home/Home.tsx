import Box from "@mui/material/Box";
import { FC } from "react";
import ScrollExp from "../utils/ScrollToAnchor";
import About from "./About";
import Contact from "./Contact";
import Welcome from "./Welcome";

const Home: FC = () => (
  <Box maxWidth="md">
    <ScrollExp id="welcome">
      <Welcome />
    </ScrollExp>
    <Box
      bgcolor="secondary.light"
      color="secondary.contrastText"
      mt={-3}
      mb={5}
      mx={-3}
      px={3}
      py={6}
    >
      <ScrollExp id="about">
        <About />
      </ScrollExp>
    </Box>
    <ScrollExp id="contact">
      <Contact />
    </ScrollExp>
  </Box>
);

export default Home;
