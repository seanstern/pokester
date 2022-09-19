import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { PokerRooms } from "@pokester/common-api";
import last from "lodash/last";
import { FC } from "react";
import { useHistory } from "react-router-dom";
import { useAct } from "../../../queries/RoomsQueries";
import ErrorSnackBar from "../../utils/ErrorSnackbar";
import BetForm from "./BetForm";

export { amountLabel } from "./BetForm";

export const postStandRedirectLocation = "/rooms/browse";

type PlayerAction = PokerRooms.Act.PlayerAction;

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
const combineSimilarActions = <T extends PlayerAction>(
  legalActions: PlayerAction[] = [],
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

export type PlayerActionsProps = {
  legalActions?: PlayerAction[];
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
    PokerRooms.Act.PlayerAction.FOLD,
    PokerRooms.Act.PlayerAction.STAND
  );

  const callOrCheck = combineSimilarActions(
    legalActions,
    PokerRooms.Act.PlayerAction.CALL,
    PokerRooms.Act.PlayerAction.CHECK
  );

  const raiseOrBet = combineSimilarActions(
    legalActions,
    PokerRooms.Act.PlayerAction.RAISE,
    PokerRooms.Act.PlayerAction.BET
  );

  return (
    <>
      <ErrorSnackBar show={act.isError} />
      <Stack direction="row" spacing={1} marginTop={1}>
        <Button
          variant="contained"
          disabled={foldOrStand.disabled}
          onClick={async () => {
            try {
              await act.mutateAsync({
                roomId,
                data: { action: foldOrStand.action },
              });
              history.push(postStandRedirectLocation);
            } catch (err) {}
          }}
        >
          {foldOrStand.action}
        </Button>
        <Button
          variant="contained"
          disabled={callOrCheck.disabled}
          onClick={() => {
            act.mutate({ roomId, data: { action: callOrCheck.action } });
          }}
        >
          {callOrCheck.action}
        </Button>
        <BetForm
          action={raiseOrBet.action}
          disabled={raiseOrBet.disabled}
          act={(data) => act.mutate({ roomId, data })}
        />
      </Stack>
    </>
  );
};

export default PlayerActions;
