import Paper from "@mui/material/Paper";
import { FC } from "react";

/**
 * Returns an empty seat.
 *
 * @returns an empty seat.
 */
const Seat: FC = () => (
  <Paper
    sx={{
      padding: 1,
      minHeight: 89,
    }}
    variant="outlined"
  />
);

export default Seat;
