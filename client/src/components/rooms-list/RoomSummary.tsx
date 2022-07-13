import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Routes } from "@pokester/common-api";
import React, { FC } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAct } from "../../queries/RoomsQueries";
import SeatingAvailabilityIcon from "./SeatingAvailabilityIcon";

type RoomSummaryProps = {
  id: string;
  name: string;
  creatorId: string;
  canSit: boolean;
  isSeated: boolean;
  act: ReturnType<typeof useAct>;
};
/**
 * Given props, returns a summary of the room including the room's name,
 * creator, seating availability in addition to buttons that let the viewer
 * sit at, watch, or return to the room (depending on the seating
 * availability).
 *
 * @param props
 * @param props.id the room id
 * @param props.name the room name
 * @param props.creatorId the id of the creator of the room
 * @param props.canSit true if the viewer can sit at the table, false otherwise
 * @param props.isSeated true if the viewer is seate at the table, false
 *   otherwise
 * @param props.act a react-query act muatation
 * @returns a summary of the room including the room's name,
 *   creator, seating availability in addition to buttons that let the viewer
 *   sit at, watch, or return to the room (depending on the seating
 *   availability).
 */
const RoomSummary: FC<RoomSummaryProps> = ({
  id,
  name,
  creatorId,
  canSit,
  isSeated,
  act,
}) => {
  const history = useHistory();
  const to = `/rooms/${id}`;
  return (
    <Card variant="outlined">
      <CardActionArea
        onClick={async () => {
          await new Promise((res) => setTimeout(res, 175));
          history.push(to);
        }}
      >
        <CardContent>
          <Typography noWrap component="h2" variant="h5">
            {name}
          </Typography>
          <Typography
            noWrap
            component="h3"
            variant="subtitle2"
            color="text.secondary"
          >
            {creatorId}
          </Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <SeatingAvailabilityIcon canSit={canSit} isSeated={isSeated} />
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          variant="contained"
          size="small"
          color="primary"
          disabled={!canSit || act.isLoading}
          onClick={async () => {
            try {
              await act.mutateAsync({
                roomId: id,
                data: {
                  action: Routes.PokerRooms.Act.PlayerAction.SIT,
                },
              });
              history.push(to);
            } catch (err) {}
          }}
        >
          Sit
        </Button>
        <Button component={Link} to={to} sx={{ marginLeft: "auto" }}>
          {isSeated ? "Return" : "Watch"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default RoomSummary;
