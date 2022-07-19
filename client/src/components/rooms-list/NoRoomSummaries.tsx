import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { FC } from "react";
import NoSearchResultsIcon from "../icons/NoSearchResultsIcon";

export const defaultText = "No rooms found.";

const NoRoomSummaries: FC = () => (
  <Box marginTop={4} marginBottom={4} color="text.secondary">
    <Box display="flex" justifyContent="center">
      <NoSearchResultsIcon />
    </Box>
    <Typography component="h2" textAlign="center">
      {defaultText}
    </Typography>
  </Box>
);

export default NoRoomSummaries;
