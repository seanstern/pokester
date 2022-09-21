import Paper from "@mui/material/Paper";
import { FC } from "react";
import Button from "@mui/material/Button";
import { useAct } from "../../../queries/RoomsQueries";
import { PokerRooms } from "@pokester/common-api";

/**
 * Given a seatNumber, returns the label for the region representing the seat.
 *
 * @param seatNumber the number of the seat
 * @returns the label for the region representing the sat
 */
export const getSeatRegionLabel = (seatNumber: number) => `Seat ${seatNumber}`;

export type SeatProps = {
  roomId: string;
  seatNumber: number;
  canSit: boolean;
};
/**
 * Given props, returns an empty seat.
 *
 * @param props
 * @param props.roomId the id of the room that the seat is in
 * @param props.seatNumber the number of the seat in the room
 * @param props.canSit a boolean indicating whether or not a player can sit
 *   at the seat
 * @returns an empty seat.
 */
const Seat: FC<SeatProps> = ({ roomId, seatNumber, canSit }) => {
  const act = useAct();

  return (
    <Paper
      sx={{
        padding: 1,
        minHeight: 89,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      variant="outlined"
      component="section"
      aria-label={getSeatRegionLabel(seatNumber)}
    >
      {(canSit || act.isLoading) && (
        <Button
          disabled={!canSit || act.isLoading}
          onClick={() =>
            act.mutate({
              roomId,
              data: { action: PokerRooms.Act.PlayerAction.SIT, seatNumber },
            })
          }
        >
          {PokerRooms.Act.PlayerAction.SIT}
        </Button>
      )}
    </Paper>
  );
};

export default Seat;
