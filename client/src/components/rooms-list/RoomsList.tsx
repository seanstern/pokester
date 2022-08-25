import Grid from "@mui/material/Grid";
import { PokerRooms } from "@pokester/common-api";
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
const gridColumns = { xs: 4, sm: 8, lg: 12 };
const noRoomSummariesGridItem = (
  <Grid key="noRoomsSummaries" item xs={true} md={8}>
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
  const parsedQs = useValidParsedQs<PokerRooms.GetAll.ReqQuery>(
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
        {gridItems}
      </Grid>
    </>
  );
};

const RoomsList: FC = () => {
  return (
    <>
      <Filters />
      <List />
    </>
  );
};

export default RoomsList;
