import React, { FC, useMemo } from "react";
import { NavLink, useRouteMatch, useLocation, Link } from "react-router-dom";
import { parse, ParsedQs } from "qs";
import { useGetAll } from "./queries/RoomsQueries";
import { Routes } from "@pokester/common-api";

interface ListProps {
  queryParams: Routes.PokerRooms.GetAll.ReqQuery;
}
const List: FC<ListProps> = ({ queryParams }) => {
  const allRoomsQuery = useGetAll(queryParams);

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
      if (allRoomsQuery.data.length === 0) {
        return <div>No rooms yet!</div>;
      }
      return (
        <ul>
          {allRoomsQuery.data.map(({ id, name }) => (
            <li key={id}>
              {name}
              <Link to={`/rooms/${id}`}>View</Link>
            </li>
          ))}
        </ul>
      );
  }
};

interface TitleProps {
  queryParams: Routes.PokerRooms.GetAll.ReqQuery;
}
const Title: FC<TitleProps> = ({ queryParams }) => {
  // X Rooms Named Y Created By Z
  const { openSeat, name, creatorId } = queryParams;
  const openTitle =
    openSeat === undefined || !["true", "false"].includes(openSeat)
      ? ""
      : openSeat === "true"
      ? "Open "
      : "Full ";
  const nameTitle = name === undefined ? "" : ` Named ${name}`;
  const creatorIdTitle =
    creatorId === undefined ? "" : ` Created by ${creatorId}`;

  return <h2>{`${openTitle}Rooms${nameTitle}${creatorIdTitle}`}</h2>;
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

interface RommsProps {}
const Rooms: FC<RommsProps> = () => {
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
        "openSeat",
        (pqv): pqv is "true" | "false" =>
          typeof pqv === "string" && ["true", "false"].includes(pqv)
      ),
    };
  }, [search]);

  return (
    <>
      <NavLink to={`${url}?openSeat=true`}>Open Rooms</NavLink>
      <NavLink to={`${url}?openSeat=false`}>Full Rooms</NavLink>
      <Title {...{ queryParams }} />
      <List {...{ queryParams }} />
    </>
  );
};

export default Rooms;
