import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { FC } from "react";
import CreatorQsSearch, {
  label as creatorSearchLabel,
} from "./CreatorQsSearch";
import NameQsSearch, { label as nameSearchLabel } from "./NameQsSearch";
import SeatedStatusQsToggle, {
  label as seatedStatusLabel,
} from "./SeatedStatusQsToggle";
import SeatingAvailabilityQsToggle, {
  label as seatingAvailabilityLabel,
} from "./SeatingAvailabilityQsToggle";

export {
  creatorSearchLabel,
  nameSearchLabel,
  seatedStatusLabel,
  seatingAvailabilityLabel,
};

/**
 * Returns a component that allows the user to filter rooms by
 *  - seating availability
 *  - their own seated status
 *  - room name
 *  - creator name
 * via query string manipultion
 *
 * @returns a component that allows the user to filter rooms by
 *    - seating availability
 *    - their own seated status
 *    - room name
 *    - creator name
 *   via query string manipulation
 */
const Filters: FC = () => {
  return (
    <>
      <Typography component="h2" variant="overline">
        Filters
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "flex-end" }}
      >
        <Stack direction="row" alignItems="flex-end" spacing={2}>
          <SeatingAvailabilityQsToggle />
          <SeatedStatusQsToggle />
        </Stack>
        <NameQsSearch />
        <CreatorQsSearch />
      </Stack>
    </>
  );
};

export default Filters;
