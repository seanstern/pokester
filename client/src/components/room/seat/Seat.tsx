import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import { ActInRoomMutation } from "../../../queries/poker-rooms";

/**
 * Given a seatNumber, returns the label for the region representing the seat.
 *
 * @param seatNumber the number of the seat
 * @returns the label for the region representing the sat
 */
export const getSeatRegionLabel = (seatNumber: number) => `Seat ${seatNumber}`;

const mailtoSubject = "Let's play pokester";
const mailtoBodyPrefix = `Join me for a game of poker at ${process.env.REACT_APP_BASE_URL}`;

/**
 * Given a pathname, returns a string representing a mailto URI for invitations.
 *
 * @param pathname a string representing a path; typically the current one
 * @returns a string representing a mailto URI for invitations.
 */
export const getInviteMailTo = (pathname: string) =>
  `mailto:?subject=${encodeURIComponent(
    mailtoSubject
  )}&body=${encodeURIComponent(`${mailtoBodyPrefix}${pathname}\n\n`)}`;

export const inviteLabel = "Invite";

export type SeatProps = {
  actInRoom: ActInRoomMutation;
  canSit: boolean;
  seatNumber: number;
  showInvite?: boolean;
};
/**
 * Given props, returns an empty seat.
 *
 * @param props
 * @param props.actInRoom an ActInRoom mutation
 * @param props.canSit a boolean indicating whether or not a player can sit
 *   at the seat
 * @param props.seatNumber the number of the seat in the room
 * @param showInvite an optional boolean indicating if the seat should show
 *   the invite button
 * @returns an empty seat.
 */
const Seat: FC<SeatProps> = ({ seatNumber, canSit, actInRoom, showInvite }) => {
  const { pathname } = useLocation();

  return (
    <Paper
      sx={{
        padding: 1,
        minHeight: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      variant="outlined"
      component="section"
      aria-label={getSeatRegionLabel(seatNumber)}
    >
      {canSit ? (
        <Button
          disabled={actInRoom.isLoading}
          onClick={() =>
            actInRoom.mutate({
              action: PokerRooms.Act.PlayerAction.SIT,
              seatNumber,
            })
          }
        >
          {PokerRooms.Act.PlayerAction.SIT}
        </Button>
      ) : showInvite ? (
        <Button href={getInviteMailTo(pathname)} startIcon={<EmailIcon />}>
          {inviteLabel}
        </Button>
      ) : null}
    </Paper>
  );
};

export default Seat;
