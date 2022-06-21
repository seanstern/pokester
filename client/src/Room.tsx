import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { Routes } from "@pokester/common-api";
import { useGet } from "./queries/RoomsQueries";

interface PlayerProps {
  position: number;
  player: Routes.PokerRooms.Get.ResBody["table"]["players"][0];
  specialPosition?: "dealer" | "smallBlind" | "bigBlind";
  currentActor: boolean;
}
const Player: FC<PlayerProps> = ({
  player,
  position,
  specialPosition,
  currentActor,
}) => {
  const { bet, folded, left, id, stackSize, holeCards, isSelf } = player ?? {};
  return (
    <tr>
      <td>{currentActor && ">>"}</td>
      <td>{position + 1}</td>
      <td>{specialPosition}</td>
      <td>{id && `${id}${isSelf ? " (You)" : ""}`}</td>
      <td>{folded}</td>
      <td>{left}</td>
      <td>{stackSize}</td>
      <td>{bet}</td>
      <td>{holeCards && `${holeCards[0].rank}${holeCards[0].suitChar}`}</td>
      <td>{holeCards && `${holeCards[1].rank}${holeCards[1].suitChar}`}</td>
    </tr>
  );
};

interface BodyProps {
  pokerRoom: Routes.PokerRooms.Get.ResBody;
}
const Body: FC<BodyProps> = ({ pokerRoom }) => {
  const {
    table: {
      currentPosition,
      dealerPosition,
      bigBlindPosition,
      smallBlindPosition,
    },
  } = pokerRoom;

  return (
    <table>
      <tr>
        <th>Curr</th>
        <th>Seat</th>
        <th>Position</th>
        <th>Player ID</th>
        <th>Folded</th>
        <th>Left</th>
        <th>Stack</th>
        <th>Bet</th>
        <th>Card</th>
        <th>Card</th>
      </tr>
      {pokerRoom.table.players.map((player, position) => (
        <Player
          key={position}
          {...{
            position,
            player,
            currentActor: currentPosition
              ? position === currentPosition
              : position === dealerPosition,
            specialPosition:
              position === dealerPosition
                ? "dealer"
                : position === smallBlindPosition
                ? "smallBlind"
                : position === bigBlindPosition
                ? "bigBlind"
                : undefined,
          }}
        />
      ))}
    </table>
  );
};

interface TitleProps {
  pokerRoom: Routes.PokerRooms.Get.ResBody;
}
const Title: FC<TitleProps> = ({ pokerRoom }) => (
  <h2>Room: "{pokerRoom.name}"</h2>
);

interface RoomProps {}
const Room: FC<RoomProps> = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const roomQuery = useGet(roomId);
  switch (roomQuery.status) {
    case "error":
      return <div>Could not load game.</div>;
    //intentional fallthrough
    case "idle":
    case "loading":
      return <div>Loading game...</div>;
    // intentional fallthrough
    case "success":
    default:
      return (
        <>
          <Title pokerRoom={roomQuery.data} />
          <Body pokerRoom={roomQuery.data} />
        </>
      );
  }
};

export default Room;
