import React, { FC, useMemo } from "react";
import { useRouteMatch, useLocation } from "react-router-dom";
import { parse, ParsedQs } from "qs";
import { useGetAll, useAct } from "../../queries/RoomsQueries";
import { Routes } from "@pokester/common-api";
import Grid from "@mui/material/Grid";
import RoomSummary from "./RoomSummary";

type ListProps = {
  queryParams: Routes.PokerRooms.GetAll.ReqQuery;
};
const List: FC<ListProps> = ({ queryParams }) => {
  const allRoomsQuery = useGetAll(queryParams);
  const act = useAct();

  switch (allRoomsQuery.status) {
    case "error":
      return <div>Could not load games.</div>;
    //intentional fallthrough
    case "idle":
    case "loading":
      return <div>Loading games...</div>;
    // intentional fallthrough
    case "success":
    default:
      return (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {allRoomsQuery.data.map((room) => (
            <Grid item key={room.id} xs={4}>
              <RoomSummary {...{ ...room, act }} />
            </Grid>
          ))}
        </Grid>
      );
  }
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

  return <h2>{`Rooms${seatedCanSitTitle}${nameTitle}${creatorIdTitle}`}</h2>;
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

type RoomsProps = {};
const Rooms: FC<RoomsProps> = () => {
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

export default Rooms;
