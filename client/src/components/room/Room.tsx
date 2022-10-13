import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PokerRooms } from "@pokester/common-api";
import { FC } from "react";
import { useParams } from "react-router-dom";
import {
  ActInRoomMutation,
  useActInRoom,
  useGet,
} from "../../queries/poker-rooms";
import getBadRequestErrorMessage from "../../utils/getBadRequestErrorMessage";
import { useSetPageTitle } from "../page-frame";
import ErrorSnackbar from "../utils/ErrorSnackbar";
import LoadingProgress from "../utils/LoadingProgress";
import CommunityCards from "./community-cards";
import {
  GridItemConfig,
  GridItemType,
  lg as lgGridConfig,
  sm as smGridConfig,
  xs as xsGridConfig,
} from "./GridConfigs";
import Player, { BlindPosition } from "./player";
import PlayerActions from "./player-actions";
import Pots from "./pots";
import Seat from "./seat";

/**
 * Given a playerId and an array of pots, returns a positive number when the
 * player has winnings and undefined otherwise.
 *
 * @param playerId id of a player
 * @param pots an array of pots
 * @returns a positive number when the player has winnings and undefined
 *   otherwise
 */
const getWinningsForPlayer = (playerId: string, pots: PokerRooms.Get.Pot[]) =>
  pots
    .map(({ amount, winners }) =>
      winners && winners.find(({ id }) => id === playerId)
        ? amount / winners.length
        : 0
    )
    .reduce((total, addend) => total + addend) || undefined;

type GridItemContentProps = {
  actInRoom: ActInRoomMutation;
  canSit: boolean;
  config: GridItemConfig;
  table: PokerRooms.Get.Table;
};
/**
 * Given props, returns contents of a Grid item in a Room.
 *
 * @param props
 * @param props.actInRoom an ActInRoomMutation
 * @param props.canSit a boolean indicating whether or not a the player can
 *   sit at the table
 * @param props.config a configuration indicating what type of content should
 *   be rendered
 * @param props.table the table in the room
 * @returns
 */
const GridItemContent: FC<GridItemContentProps> = ({
  actInRoom,
  canSit,
  config,
  table,
}) => {
  if (config.type === GridItemType.COMMUNITY_CARDS) {
    return <CommunityCards communityCards={table.communityCards} />;
  }
  if (config.type === GridItemType.POTS) {
    return <Pots pots={table.pots} />;
  }
  const { seatNumber } = config;
  const player = table.players[seatNumber];
  const inviteSeatNumber = table.players.findIndex((p) => !p);
  if (!player) {
    return (
      <Seat
        seatNumber={seatNumber}
        canSit={canSit}
        actInRoom={actInRoom}
        showInvite={inviteSeatNumber === seatNumber}
      />
    );
  }
  return (
    <Player
      {...player}
      blindPosition={
        seatNumber === table.bigBlindPosition
          ? BlindPosition.BIG
          : seatNumber === table.smallBlindPosition
          ? BlindPosition.SMALL
          : undefined
      }
      isCurrentActor={seatNumber === table.currentPosition}
      isDealer={seatNumber === table.dealerPosition}
      isRoundInProgress={!!table.currentRound}
      seatNumber={seatNumber}
      winnings={getWinningsForPlayer(player.id, table.pots)}
    />
  );
};

/**
 * Given a configuration and a table, returns true when the contents of the
 * grid item will appear elevated and false otherwise. Userful for adjusting
 * zIndex of grid items to ensure proper shadowing.
 *
 * @param config a configuration indicating what type of content should
 *   be rendered by the grid item
 * @param table the table in the room
 * @returns true when the contents of the grid item will appear elevated false
 *   otherwise
 */
const isGridItemElevated = (
  config: GridItemConfig,
  table: PokerRooms.Get.Table
) => {
  if (config.type !== GridItemType.PLAYER) {
    return false;
  }
  const player = table.players[config.seatNumber];
  if (!player) {
    return false;
  }
  if (
    !getWinningsForPlayer(player.id, table.pots) &&
    config.seatNumber !== table.currentPosition
  ) {
    return false;
  }
  return true;
};

/**
 * Given props, returns a poker room (players, community cards, pots, and
 * actions).
 *
 *
 * @returns
 */
const Room: FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const roomQuery = useGet(roomId);

  const actInRoom = useActInRoom(roomId);

  useSetPageTitle(roomQuery.data?.name || "");

  const theme = useTheme();

  const shouldUseXsGrid = useMediaQuery(theme.breakpoints.only("xs"));

  const shouldUseSmGrid = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const queryOrMutationInProgress = roomQuery.isLoading || actInRoom.isLoading;

  const isQueryOrMutationError = roomQuery.isError || actInRoom.isError;

  const { spacing, columns, itemConfigs } = shouldUseXsGrid
    ? xsGridConfig
    : shouldUseSmGrid
    ? smGridConfig
    : lgGridConfig;

  return (
    <>
      <ErrorSnackbar
        show={isQueryOrMutationError && !queryOrMutationInProgress}
        message={getBadRequestErrorMessage(actInRoom.error)}
      ></ErrorSnackbar>
      <LoadingProgress show={queryOrMutationInProgress} />
      {roomQuery.data && (
        <>
          <Grid container spacing={spacing} columns={columns}>
            {itemConfigs.map((itemConfig, idx) => (
              <Grid
                key={idx}
                item
                xs={1}
                sx={
                  isGridItemElevated(itemConfig, roomQuery.data.table)
                    ? { zIndex: 1 }
                    : undefined
                }
              >
                <GridItemContent
                  config={itemConfig}
                  table={roomQuery.data.table}
                  canSit={roomQuery.data.canSit}
                  actInRoom={actInRoom}
                />
              </Grid>
            ))}
          </Grid>
          <PlayerActions
            actInRoom={actInRoom}
            legalActions={
              (
                roomQuery.data.table.players.find(
                  (p) => p?.isSelf
                ) as Partial<PokerRooms.Get.SelfPlayer>
              )?.legalActions
            }
            betAtRoundStart={roomQuery.data.table.bigBlind}
            currentRound={roomQuery.data.table.currentRound}
          />
        </>
      )}
    </>
  );
};

export default Room;
