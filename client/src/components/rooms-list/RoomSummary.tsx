import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { Routes } from "@pokester/common-api";
import React, { FC } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAct } from "../../queries/RoomsQueries";
import SeatingAvailabilityIcon from "./SeatingAvailabilityIcon";

/**
 * Given props, returns the skeletal child components of a room summary (i.e.
 * those that are replaced by skeleton components when props.skeleton is true).
 * When props.skeleton is true, all skeletal child components will be
 * skeletons; otherwise all skeletal child components will be regular
 * components.
 *
 * @param props
 * @param props.skeleton true to return skeletons; falsy to return a regular
 *   components
 * @param props.id the room id; required when props.skeleton is falsy
 * @param props.name the room name; required when props.skeleton is falsy
 * @param props.creatorId the id of the creator of the room; required when
 *   props.skeleton is falsy
 * @param props.canSit true if the viewer can sit at the table, false
 *   otherwise; required when props.skeleton is falsy
 * @param props.isSeated true if the viewer is seate at the table, false
 *   otherwise; required when props.skeleton is falsy
 * @param props.act a react-query act muatation; required when props.skeleton
 *   is falsy
 *
 * @returns the skeletal components of a room summary (i.e. those that are
 *   replaced by skeleton components when props.skeleton is true). When
 *   props.skeleton is true, all skeletal child components will be skeletons;
 *   otherwise all skeletal child components will be regular components.
 */
const useSkeletalChildComponents = (
  props: RoomSummaryProps | RoomSummarySkeletonProps
) => {
  const history = useHistory();

  const isSkeleton = props.skeleton;

  const to = isSkeleton ? "" : `/rooms/${props.id}`;

  const cardActionOnClick = isSkeleton
    ? async () => Promise.resolve()
    : async () => {
        await new Promise((res) => setTimeout(res, 175));
        history.push(to);
      };

  const name = isSkeleton ? <Skeleton /> : props.name;

  const creatorId = isSkeleton ? <Skeleton /> : props.creatorId;

  const seatingAvailabilityIcon = (
    <SeatingAvailabilityIcon
      canSit={isSkeleton || props.canSit}
      isSeated={isSkeleton || props.isSeated}
    />
  );

  const wrappedSeatingAvailabilityIcon = isSkeleton ? (
    <Skeleton>{seatingAvailabilityIcon}</Skeleton>
  ) : (
    seatingAvailabilityIcon
  );

  const sitButtonDisabled = isSkeleton
    ? true
    : !props.canSit || props.act.isLoading;

  const sitButtonOnClick = isSkeleton
    ? async () => Promise.resolve()
    : async () => {
        try {
          await props.act.mutateAsync({
            roomId: props.id,
            data: {
              action: Routes.PokerRooms.Act.PlayerAction.SIT,
            },
          });
          history.push(to);
        } catch (err) {}
      };
  const sitButton = (
    <Button
      variant="contained"
      color="primary"
      disabled={sitButtonDisabled}
      onClick={sitButtonOnClick}
    >
      Sit
    </Button>
  );
  const wrappedSitButton = isSkeleton ? (
    <Skeleton>{sitButton}</Skeleton>
  ) : (
    sitButton
  );

  const viewButton = (
    <Button component={Link} to={to} sx={{ marginLeft: "auto" }}>
      {isSkeleton || props.isSeated ? "Return" : "Watch"}
    </Button>
  );

  const wrappedViewButton = isSkeleton ? (
    <Skeleton component="div" sx={{ marginLeft: "auto" }}>
      {viewButton}
    </Skeleton>
  ) : (
    viewButton
  );

  return {
    cardActionOnClick,
    name,
    creatorId,
    seatingAvailabilityIcon: wrappedSeatingAvailabilityIcon,
    sitButton: wrappedSitButton,
    viewButton: wrappedViewButton,
  };
};

export type RoomSummaryProps = {
  skeleton?: false | undefined;
  id: string;
  name: string;
  creatorId: string;
  canSit: boolean;
  isSeated: boolean;
  act: ReturnType<typeof useAct>;
};
export type RoomSummarySkeletonProps = {
  skeleton: true;
};
/**
 * Given props, returns a skeleton summary of a room or a summary of the
 * room including the room's name, creator, seating availability in addition
 * to buttons that let the viewer sit at, watch, or return to the room
 * (depending on the seating availability).
 *
 * @param props
 * @param props.skeleton true to return a skeleton summary of a room; falsy
 *   to return a summary of a room
 * @param props.id the room id; required when props.skeleton is falsy
 * @param props.name the room name; required when props.skeleton is falsy
 * @param props.creatorId the id of the creator of the room; required when
 *   props.skeleton is falsy
 * @param props.canSit true if the viewer can sit at the table, false
 *   otherwise; required when props.skeleton is falsy
 * @param props.isSeated true if the viewer is seate at the table, false
 *   otherwise; required when props.skeleton is falsy
 * @param props.act a react-query act muatation; required when props.skeleton
 *   is falsy
 * @returns when props.skeleton is true, a skeleton summary of a room;
 *   otherwise a summary of the room including the room's name,
 *   creator, seating availability in addition to buttons that let the viewer
 *   sit at, watch, or return to the room (depending on the seating
 *   availability).
 */
const RoomSummary: FC<RoomSummaryProps | RoomSummarySkeletonProps> = (
  props
) => {
  const {
    cardActionOnClick,
    name,
    creatorId,
    seatingAvailabilityIcon,
    sitButton,
    viewButton,
  } = useSkeletalChildComponents(props);

  const cardAriaBusyProps = props.skeleton ? { "aria-hidden": true } : {};
  const ariaTitleId = props.skeleton ? "" : `title-for-room-id-${props.id}`;
  const ariaTitleProps = props.skeleton ? {} : { id: ariaTitleId };
  const ariaLablledByTitleProps = props.skeleton
    ? {}
    : { "aria-labelledby": ariaTitleId };

  return (
    <Card
      component="article"
      variant="outlined"
      {...{ ...ariaLablledByTitleProps, ...cardAriaBusyProps }}
    >
      <CardActionArea
        disabled={!!props.skeleton}
        onClick={cardActionOnClick}
        {...ariaLablledByTitleProps}
      >
        <CardContent>
          <Typography noWrap component="h2" variant="h5" {...ariaTitleProps}>
            {name}
          </Typography>
          <Typography
            noWrap
            component="p"
            variant="subtitle2"
            color="text.secondary"
          >
            {creatorId}
          </Typography>
          <Box mt={2} display="flex" justifyContent="center">
            {seatingAvailabilityIcon}
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {sitButton}
        {viewButton}
      </CardActions>
    </Card>
  );
};

export default RoomSummary;
