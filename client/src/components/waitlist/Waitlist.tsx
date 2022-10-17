import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FC } from "react";

const Waitlist: FC = () => (
  <Box display="flex" flexDirection="column" maxWidth="md" alignItems="center">
    <Alert>
      <AlertTitle>You're on the Waitlist</AlertTitle>
      Thanks for signing up. When Pokester can accommodate more beta testers,
      we'll reach out to you via email.
    </Alert>
    <Button sx={{ mt: 2 }} href="/account/logout" variant="contained">
      Log out
    </Button>
  </Box>
);

export default Waitlist;
