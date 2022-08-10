import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Routes } from "@pokester/common-api";
import React, { FC } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAct } from "../../queries/RoomsQueries";
import SeatingAvailabilityIcon from "../icons/SeatingAvailabilityIcon";

export const findByCreatorLinkLabelPrefix = "Find rooms created by";
export const sitButtonLabel = "Sit";
export const watchLinkLabel = "Watch";
export const returnLinkLabel = "Return";

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

  const to = isSkeleton ? "" : `/room/${props.id}`;

  const name = isSkeleton ? <Skeleton /> : props.name;

  const creator = isSkeleton ? (
    <Skeleton />
  ) : (
    <>
      <Tooltip title={`${findByCreatorLinkLabelPrefix} ${props.creatorId}`}>
        <IconButton
          color="primary"
          component={Link}
          to={`?creatorId=${props.creatorId}`}
          size="small"
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
      {props.creatorId}
    </>
  );

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
      {sitButtonLabel}
    </Button>
  );
  const wrappedSitButton = isSkeleton ? (
    <Skeleton>{sitButton}</Skeleton>
  ) : (
    sitButton
  );

  const viewButton = (
    <Button component={Link} to={to} sx={{ marginLeft: "auto" }}>
      {isSkeleton || props.isSeated ? returnLinkLabel : watchLinkLabel}
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
    name,
    creator,
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
  const { name, creator, seatingAvailabilityIcon, sitButton, viewButton } =
    useSkeletalChildComponents(props);

  const cardAriaBusyProps = props.skeleton ? { "aria-hidden": true } : {};
  const ariaTitleId = props.skeleton ? "" : `title-for-room-id-${props.id}`;
  const ariaTitleProps = props.skeleton ? {} : { id: ariaTitleId };
  const ariaLablledByTitleProps = props.skeleton
    ? {}
    : { "aria-labelledby": ariaTitleId };

  return (
    <Card
      component="article"
      variant="elevation"
      {...{ ...ariaLablledByTitleProps, ...cardAriaBusyProps }}
    >
      <CardContent>
        <Typography noWrap component="h2" variant="h5" {...ariaTitleProps}>
          {name}
        </Typography>
        <Typography
          noWrap
          component="p"
          variant="subtitle1"
          color="text.secondary"
        >
          {creator}
        </Typography>
        <Box mt={2} display="flex" justifyContent="center">
          {seatingAvailabilityIcon}
        </Box>
      </CardContent>
      <CardActions>
        {sitButton}
        {viewButton}
      </CardActions>
    </Card>
  );
};

export default RoomSummary;
