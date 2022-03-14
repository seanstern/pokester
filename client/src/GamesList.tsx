import React, { FC } from "react";
import { Link, useParams } from "react-router-dom";
import GamesQueries from "./queries/GamesQueries";
import GameCreator from "./GameCreator";

interface IGamesListProps {}

const GamesListContent: FC<IGamesListProps> = (props) => {
  const { filter } = useParams<{ filter: "join" | "current" | "past" }>();

  const allGamesQ = GamesQueries.useGetAll(filter);

  switch (allGamesQ.status) {
    case "error":
      return <div>Could not load games.</div>;
    //intentional fallthrough
    case "idle":
    case "loading":
      return <div>Loading games...</div>;
    // intentional fallthrough
    case "success":
    default:
      if (allGamesQ.data.length === 0) {
        return (
          <>
            <div>No games yet!</div>
            {filter === "join" && <GameCreator />}
          </>
        );
      }
      return (
        <ul>
          {allGamesQ.data.map((s) => (
            <li key={s}>
              <Link to={`/game/${s}`}>Game {s}</Link>
            </li>
          ))}
        </ul>
      );
  }
};

const GamesListTitle: FC<IGamesListProps> = (props) => {
  const { filter } = useParams<{ filter: "join" | "current" | "past" }>();

  switch (filter) {
    case "join":
      return <h2>Games to join...</h2>;
    case "current":
      return <h2>Your current games...</h2>;
    case "past":
      return <h2>Your past games...</h2>;
    default:
      return <h2>Something went wrong</h2>;
  }
};

const GamesList: FC<IGamesListProps> = (props) => (
  <>
    <GamesListTitle {...props} />
    <GamesListContent {...props} />
  </>
);

export default GamesList;
