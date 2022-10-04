import { PokerRooms } from "@pokester/common-api";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { FC, useMemo } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useAct, useGet } from "../../queries/poker-rooms";
import { useSetPageTitle } from "../page-frame";

type PlayerProps = {
  position: number;
  player: PokerRooms.Get.Player | null;
  specialPosition?: "dealer" | "smallBlind" | "bigBlind";
  currentActor: boolean;
};
const Player: FC<PlayerProps> = ({
  player,
  position,
  specialPosition,
  currentActor,
}) => {
  const { bet, folded, left, id, stackSize, holeCards, isSelf, handDescr } =
    player ?? {};
  return (
    <tr className={currentActor ? "currentActor" : left ? "leftPlayer" : ""}>
      <td>{position + 1}</td>
      <td>{specialPosition}</td>
      <td className={folded ? "foldedPlayer" : ""}>
        {id && `${id}${isSelf ? " (You)" : ""}`}
      </td>
      <td>{stackSize}</td>
      <td>{bet}</td>
      <td>{holeCards && `${holeCards[0].rank}${holeCards[0].suitChar}`}</td>
      <td>{holeCards && `${holeCards[1].rank}${holeCards[1].suitChar}`}</td>
      <td>{handDescr}</td>
    </tr>
  );
};

type PlayersProps = {
  table: PokerRooms.Get.Table;
};
const Players: FC<PlayersProps> = ({ table }) => {
  const {
    currentPosition,
    dealerPosition,
    smallBlindPosition,
    bigBlindPosition,
  } = table;

  const playerRows = table.players.map((player, position) => (
    <Player
      key={position}
      {...{
        position,
        player,
        currentActor: position === currentPosition,
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
  ));
  const headerRow = (
    <tr>
      <th>Seat</th>
      <th>Position</th>
      <th>Player ID</th>
      <th>Stack</th>
      <th>Bet</th>
      <th colSpan={2}>Hole Cards</th>
      <th>Hand</th>
    </tr>
  );
  return (
    <table>
      <thead>{headerRow}</thead>
      <tbody>{playerRows}</tbody>
    </table>
  );
};

type BetActionProps = {
  roomId: string;
  action: PokerRooms.Get.PlayerAction.BET | PokerRooms.Get.PlayerAction.RAISE;
};
const BetAction: FC<BetActionProps> = ({ roomId, action }) => {
  const act = useAct();
  return (
    <Formik
      initialValues={{ amount: 0 } as { amount: number }}
      initialErrors={{ amount: "Required" } as { amount?: string }}
      validate={(values) => {
        const errors = {} as { amount?: string };
        if ((values.amount as any) === "") {
          errors.amount = "Required";
        } else if (values.amount <= 0) {
          console.log((values.amount as any) === "");
          errors.amount = "Must be positive";
        }
        return errors;
      }}
      onSubmit={async (values) =>
        act.mutateAsync({
          roomId,
          data: { ...values, action },
        })
      }
    >
      {(fb) => (
        <Form>
          <label>
            Amount
            <Field type="number" name="amount" />
            <ErrorMessage name="amount" />
          </label>
          <button type="submit" disabled={fb.isSubmitting || !fb.isValid}>
            {action.toUpperCase()}
          </button>
        </Form>
      )}
    </Formik>
  );
};

type PlayerActionProps = {
  playerAction: PokerRooms.Get.PlayerAction;
};
const PlayerAction: FC<PlayerActionProps> = ({ playerAction }) => {
  const history = useHistory();
  const match = useRouteMatch<{ roomId: string }>("/rooms/:roomId");
  const act = useAct();

  if (!match) {
    return <></>;
  }

  const {
    params: { roomId },
  } = match;

  switch (playerAction) {
    case PokerRooms.Get.PlayerAction.BET:
    case PokerRooms.Get.PlayerAction.RAISE:
      return <BetAction action={playerAction} roomId={roomId} />;
    case PokerRooms.Get.PlayerAction.STAND:
      return (
        <button
          onClick={async () => {
            try {
              await act.mutateAsync({ roomId, data: { action: playerAction } });
              history.push("..");
            } catch (err) {}
          }}
        >
          {playerAction.toUpperCase()}
        </button>
      );
    case PokerRooms.Get.PlayerAction.SIT:
    case PokerRooms.Get.PlayerAction.CHECK:
    case PokerRooms.Get.PlayerAction.CALL:
    case PokerRooms.Get.PlayerAction.FOLD:
    case PokerRooms.Get.PlayerAction.DEAL:
      return (
        <button
          onClick={() => act.mutate({ roomId, data: { action: playerAction } })}
        >
          {playerAction.toUpperCase()}
        </button>
      );
    default:
      return <></>;
  }
};

type PlayerActionsProps = {
  selfPlayer?: PokerRooms.Get.SelfPlayer;
};
const PlayerActions: FC<PlayerActionsProps> = ({ selfPlayer }) => {
  if (!selfPlayer || !selfPlayer.legalActions) {
    return <></>;
  }
  return (
    <>
      {selfPlayer.legalActions
        .filter((la) => la !== PokerRooms.Get.PlayerAction.STAND)
        .map((legalAction) => (
          <PlayerAction playerAction={legalAction} key={legalAction} />
        ))}
    </>
  );
};

const communityCardLabels = ["Flop", "Flop", "Flop", "Turn", "River"];
const headerCells = communityCardLabels.map((label, idx) => (
  <th key={idx}>{label}</th>
));
const communityCardsToStrings = (communityCards: PokerRooms.Get.Card[]) =>
  communityCardLabels.map((_, idx) => {
    const communityCard = communityCards[idx] ?? { rank: "?", suitChar: "?" };
    return `${communityCard.rank}${communityCard.suitChar}`;
  });

type CommunityCardsProps = {
  communityCards: PokerRooms.Get.Card[];
};
const CommunityCards: FC<CommunityCardsProps> = ({ communityCards }) => {
  const communityCardStrings = useMemo(
    () => communityCardsToStrings(communityCards),
    [communityCards]
  );
  return (
    <table>
      <thead>
        <tr>{headerCells}</tr>
      </thead>
      <tbody>
        <tr>
          {communityCardStrings.map((ccs, idx) => (
            <td key={idx}>{ccs}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

type PotProps = {
  pot: PokerRooms.Get.Pot;
};
const Pot: FC<PotProps> = ({ pot }) => {
  const { amount, eligiblePlayers, winners } = pot;
  return (
    <>
      {eligiblePlayers.map((ep, idx) => (
        <tr key={idx}>
          {idx === 0 && <td rowSpan={eligiblePlayers.length}>{amount}</td>}
          <td>{ep.id}</td>
          {winners && winners[idx] && <td>{winners[idx].id}</td>}
        </tr>
      ))}
    </>
  );
};

type PotsProps = {
  pots: PokerRooms.Get.Pot[];
};
const Pots: FC<PotsProps> = ({ pots }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Amount</th>
          <th>Eligible Player(s)</th>
          <th>Winner(s)</th>
        </tr>
      </thead>
      <tbody>
        {pots.map((p, idx) => (
          <Pot key={idx} pot={p} />
        ))}
      </tbody>
    </table>
  );
};

type BodyProps = {
  table: PokerRooms.Get.Table;
};
const Body: FC<BodyProps> = ({ table }) => {
  const selfPlayer = table.players.find((p) => p?.isSelf) as
    | PokerRooms.Get.SelfPlayer
    | undefined;
  return (
    <>
      <CommunityCards communityCards={table.communityCards} />
      <Players table={table} />
      <PlayerActions selfPlayer={selfPlayer} />
      <Pots pots={table.pots} />
    </>
  );
};

type RoomProps = {};
const Room: FC<RoomProps> = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const roomQuery = useGet(roomId);
  useSetPageTitle(roomQuery.data?.name || "");
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
          {roomQuery.data.canSit && (
            <PlayerAction playerAction={PokerRooms.Act.PlayerAction.SIT} />
          )}
          {roomQuery.data.table.players.find(
            (p) =>
              p?.isSelf &&
              p?.legalActions?.find(
                (la) => la === PokerRooms.Act.PlayerAction.STAND
              )
          ) && (
            <PlayerAction playerAction={PokerRooms.Act.PlayerAction.STAND} />
          )}
          <Body table={roomQuery.data.table} />
        </>
      );
  }
};

export default Room;
