import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import { Routes } from "@pokester/common-api";
import { parse, ParsedQs } from "qs";
import React, { FC, useMemo } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { useAct, useGetAll } from "../../queries/RoomsQueries";
import ErrorSnackbar from "../utils/ErrorSnackbar";
import LoadingProgress from "../utils/LoadingProgress";
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

type ListProps = {
  queryParams: Routes.PokerRooms.GetAll.ReqQuery;
};
const List: FC<ListProps> = ({ queryParams }) => {
  const getAll = useGetAll(queryParams);
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

type TitleProps = {
  queryParams: Routes.PokerRooms.GetAll.ReqQuery;
};
const Title: FC<TitleProps> = ({ queryParams }) => {
  const { canSit, isSeated, name, creatorId } = queryParams;

  const seatedTitle =
    isSeated === undefined || !["true", "false"].includes(isSeated)
      ? ""
      : isSeated === "true"
      ? " Are In"
      : " Aren't In";
  const canSitTitle =
    isSeated === "true" ||
    canSit === undefined ||
    !["true", "false"].includes(canSit)
      ? ""
      : canSit === "true"
      ? " Can Join"
      : " Can't Join";
  const seatedCanSitPrefix =
    seatedTitle === "" && canSitTitle === "" ? "" : " You";
  const seatedCanSitConjunction =
    seatedTitle === "" || canSitTitle === "" ? "" : " and";
  const seatedCanSitTitle = `${seatedCanSitPrefix}${seatedTitle}${seatedCanSitConjunction}${canSitTitle}`;

  const nameTitle = name === undefined ? "" : ` Named ${name}`;

  const creatorIdTitle =
    creatorId === undefined ? "" : ` Created by ${creatorId}`;

  return <h1>{`Rooms${seatedCanSitTitle}${nameTitle}${creatorIdTitle}`}</h1>;
};

const pickEntry = <
  T extends keyof Routes.PokerRooms.GetAll.ReqQuery,
  U extends ParsedQs["key"]
>(
  parsedQs: ParsedQs,
  getAllReqQueryKey: T,
  shouldPick: (parsedQVal: ParsedQs["key"]) => parsedQVal is U
): Partial<Record<T, U>> => {
  const parsedQValue = parsedQs[getAllReqQueryKey];
  if (!shouldPick(parsedQValue)) {
    return {};
  }
  return {
    [getAllReqQueryKey]: parsedQValue,
  } as Record<T, U>;
};

type RoomsListProps = {};
const RoomsList: FC<RoomsListProps> = () => {
  const { url } = useRouteMatch();
  const { search } = useLocation();
  const queryParams = useMemo(() => {
    const parsedQs = parse(new URLSearchParams(search).toString());
    return {
      ...pickEntry(
        parsedQs,
        "name",
        (pqv): pqv is string => typeof pqv === "string"
      ),
      ...pickEntry(
        parsedQs,
        "creatorId",
        (pqv): pqv is string => typeof pqv === "string"
      ),
      ...pickEntry(
        parsedQs,
        "canSit",
        (pqv): pqv is "true" | "false" =>
          typeof pqv === "string" && ["true", "false"].includes(pqv)
      ),
      ...pickEntry(
        parsedQs,
        "isSeated",
        (pqv): pqv is "true" | "false" =>
          typeof pqv === "string" && ["true", "false"].includes(pqv)
      ),
    };
  }, [search]);

  return (
    <>
      <Title {...{ queryParams }} />
      <List {...{ queryParams, url }} />
    </>
  );
};

export default RoomsList;
