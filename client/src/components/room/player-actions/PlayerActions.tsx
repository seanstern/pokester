import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { PokerRooms } from "@pokester/common-api";
import last from "lodash/last";
import { FC } from "react";
import { useHistory } from "react-router-dom";
import { ActInRoomMutation } from "../../../queries/poker-rooms";
import BetForm from "./BetForm";

export { amountLabel } from "./BetForm";

export const postStandRedirectLocation = "/rooms/browse";

type PlayerActionType = PokerRooms.Act.PlayerAction;
const PlayerActionEnum = PokerRooms.Act.PlayerAction;

/**
 * Given a set of legal actions a player can take and set of "similar actions"
 * that can be combined/consolidated into one action in the UI, returns an
 * object containing
 *   - the highest priorty "simlar action" available in legalActions; the last/
 *     lowest priority "similar action" if none of the "similar actions" are
 *     present in legal actions
 *   - a boolean indicating if the "similar action" above was absent from the
 *     legal actions, which, in turn, indicates if the "simlar action" should
 *     be disabled in the UI
 *
 * @param legalActions a set of legal actions a player can take
 * @param similarActionsByPriority a set of "similar actions" (ordered by
 * priority) that can be combined/consolidated into one action in the UI
 * @returns an object containing
 *   - the highest priorty "simlar action" available in legalActions; the last/
 *     lowest priority "similar action" if none of the "similar actions" are
 *     present in legal actions
 *   - a boolean indicating if the "similar action" above was absent from the
 *     legal actions, which, in turn, indicates if the "simlar action" should
 *     be disabled in the UI
 */
const combineSimilarActions = <T extends PlayerActionType>(
  legalActions: PlayerActionType[] = [],
  ...similarActionsByPriority: T[]
) => {
  for (const similarAction of similarActionsByPriority) {
    if (legalActions.includes(similarAction)) {
      return { disabled: false, action: similarAction };
    }
  }
  return {
    disabled: true,
    action: last(similarActionsByPriority) as T,
  };
};

const buttonSx = { maxWidth: 64 };

export type PlayerActionsProps = {
  actInRoom: ActInRoomMutation;
  betAtRoundStart: number;
  currentRound?: PokerRooms.Get.BettingRound;
  legalActions?: PlayerActionType[];
};
/**
 * Give props, returns UI representing the actions a player can take.
 *
 * @param props
 * @param props.actInRoom an ActInRoom mutation
 * @param props.betAtRoundStart the bet amount at the start of a round
 * @param props.currentRound the current round
 * @param props.legalActions optional legal actions a player can take
 * @returns UI representing the actions a player can take.
 */
const PlayerActions: FC<PlayerActionsProps> = ({
  actInRoom,
  betAtRoundStart,
  currentRound,
  legalActions,
}) => {
  const history = useHistory();

  const foldOrStand = combineSimilarActions(
    legalActions,
    PlayerActionEnum.FOLD,
    PlayerActionEnum.STAND
  );

  const dealCallOrCheck = combineSimilarActions(
    legalActions,
    PlayerActionEnum.DEAL,
    PlayerActionEnum.CALL,
    PlayerActionEnum.CHECK
  );

  const raiseOrBet = combineSimilarActions(
    legalActions,
    PlayerActionEnum.RAISE,
    PlayerActionEnum.BET
  );

  return (
    <>
      <Stack direction="row" spacing={1} marginTop={1}>
        <Button
          variant="contained"
          disabled={foldOrStand.disabled || actInRoom.isLoading}
          sx={buttonSx}
          onClick={async () => {
            const mutateArg = { action: foldOrStand.action };
            if (mutateArg.action === PlayerActionEnum.STAND) {
              try {
                await actInRoom.mutateAsync(mutateArg);
                history.push(postStandRedirectLocation);
              } catch (err) {}
              return;
            }
            actInRoom.mutate(mutateArg);
          }}
        >
          {foldOrStand.action}
        </Button>
        <Button
          variant="contained"
          disabled={dealCallOrCheck.disabled || actInRoom.isLoading}
          onClick={() => {
            actInRoom.mutate({ action: dealCallOrCheck.action });
          }}
          sx={buttonSx}
        >
          {dealCallOrCheck.action}
        </Button>
        <BetForm
          action={raiseOrBet.action}
          disabled={raiseOrBet.disabled || actInRoom.isLoading}
          actInRoom={actInRoom}
          buttonSx={buttonSx}
          amountAtRoundStart={betAtRoundStart}
          currentRound={currentRound}
        />
      </Stack>
    </>
  );
};

export default PlayerActions;
