import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { PokerRooms } from "@pokester/common-api";
import last from "lodash/last";
import { FC } from "react";
import { useHistory } from "react-router-dom";
import { useAct } from "../../../queries/poker-rooms";
import ErrorSnackBar from "../../utils/ErrorSnackbar";
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
  legalActions?: PlayerActionType[];
  roomId: string;
};
/**
 * Give props, returns UI representing the actions a player can take.
 * @param props
 * @param props.legalActions the legal actions a player can take
 * @param props.roomId the room the player is in
 * @returns UI representing the actions a player can take.
 */
const PlayerActions: FC<PlayerActionsProps> = ({ legalActions, roomId }) => {
  const act = useAct();
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
      <ErrorSnackBar show={act.isError} />
      <Stack direction="row" spacing={1} marginTop={1}>
        <Button
          variant="contained"
          disabled={foldOrStand.disabled || act.isLoading}
          sx={buttonSx}
          onClick={async () => {
            const mutateArg = {
              roomId,
              data: { action: foldOrStand.action },
            };
            if (mutateArg.data.action === PlayerActionEnum.STAND) {
              try {
                await act.mutateAsync(mutateArg);
                history.push(postStandRedirectLocation);
              } catch (err) {}
              return;
            }
            act.mutate(mutateArg);
          }}
        >
          {foldOrStand.action}
        </Button>
        <Button
          variant="contained"
          disabled={dealCallOrCheck.disabled || act.isLoading}
          onClick={() => {
            act.mutate({ roomId, data: { action: dealCallOrCheck.action } });
          }}
          sx={buttonSx}
        >
          {dealCallOrCheck.action}
        </Button>
        <BetForm
          action={raiseOrBet.action}
          disabled={raiseOrBet.disabled || act.isLoading}
          act={(data) => act.mutate({ roomId, data })}
          buttonSx={buttonSx}
        />
      </Stack>
    </>
  );
};

export default PlayerActions;
