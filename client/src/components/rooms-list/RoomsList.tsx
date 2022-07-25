import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Routes } from "@pokester/common-api";
import React, { FC } from "react";
import useValidParsedQs from "../../hooks/qs/useValidParsedQs";
import { useAct, useGetAll } from "../../queries/RoomsQueries";
import ErrorSnackbar from "../utils/ErrorSnackbar";
import LoadingProgress from "../utils/LoadingProgress";
import Filters from "./filters";
import NoRoomSummaries from "./NoRoomSummaries";
import RoomSummary, { RoomSummarySkeletonProps } from "./RoomSummary";

const skeletonRoomSummaryProps: RoomSummarySkeletonProps = { skeleton: true };
const skeletonRoomSummaryPropsWithKeyList = [
  { ...skeletonRoomSummaryProps, key: 0 },
];
const gridColumns = { xs: 4, sm: 8, md: 12 };
const noRoomSummariesGridItem = (
  <Grid
    key="noRoomsSummaries"
    item
    xs={gridColumns.xs}
    sm={gridColumns.sm}
    md={gridColumns.md}
  >
    <NoRoomSummaries />
  </Grid>
);

const isRoomsGetAllValidParsedQsMap = {
  name: (pqv: any): pqv is string => typeof pqv === "string" && pqv.length > 0,
  creatorId: (pqv: any): pqv is string =>
    typeof pqv === "string" && pqv.length > 0,
  canSit: (pqv: any): pqv is "true" | "false" =>
    typeof pqv === "string" && ["true", "false"].includes(pqv),
  isSeated: (pqv: any): pqv is "true" | "false" =>
    typeof pqv === "string" && ["true", "false"].includes(pqv),
};
const List: FC = () => {
  const parsedQs = useValidParsedQs<Routes.PokerRooms.GetAll.ReqQuery>(
    isRoomsGetAllValidParsedQsMap
  );
  const getAll = useGetAll(parsedQs);
  const act = useAct();

  const queryOrMutationInProgress = getAll.isFetching || act.isLoading;
  const isQueryOrMutationError = getAll.isError || act.isError;

  const roomSummariesPropsWithKey = !getAll.data
    ? skeletonRoomSummaryPropsWithKeyList
    : getAll.data.map((room) => ({ ...room, act, key: room.id }));

  const gridItems =
    roomSummariesPropsWithKey.length <= 0
      ? [noRoomSummariesGridItem]
      : roomSummariesPropsWithKey.map((roomSummaryProps) => (
          <Grid key={roomSummaryProps.key} item xs={gridColumns.xs}>
            <RoomSummary {...{ ...roomSummaryProps, act }} />
          </Grid>
        ));

  return (
    <>
      <ErrorSnackbar
        show={!queryOrMutationInProgress && isQueryOrMutationError}
      />
      <LoadingProgress show={queryOrMutationInProgress} />
      <Grid container spacing={{ xs: 2, md: 3 }} columns={gridColumns}>
        {gridItems.map((gridItem) => (
          <Fade key={gridItem.key} in={true}>
            {gridItem}
          </Fade>
        ))}
      </Grid>
    </>
  );
};

type RoomsListProps = {};
const RoomsList: FC<RoomsListProps> = () => {
  return (
    <>
      <Typography variant="h4" component="h1">
        Rooms
      </Typography>
      <Filters />
      <List />
    </>
  );
};

export default RoomsList;
