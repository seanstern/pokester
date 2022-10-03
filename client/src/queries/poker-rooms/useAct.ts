import { PokerRooms } from "@pokester/common-api";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { path, queryKey } from "./config";
import popLegalActions, {
  LegalActions,
} from "./mutation-utils/LegalActionsPopper";
import pushLegalActions from "./mutation-utils/LegalActionsPusher";

type ActParam = {
  roomId: string;
  data: PokerRooms.Act.ReqBody;
};
type ActContext = {
  pokerRoom?: PokerRooms.Get.ResBody;
  legalActions?: LegalActions;
  canSit?: boolean;
};
const useAct = () => {
  const qc = useQueryClient();

  return useMutation<void, AxiosError<string>, ActParam, ActContext>(
    async ({ roomId, data }: ActParam): Promise<void> => {
      await axios.patch<undefined>(`${path}/${roomId}`, data, {
        validateStatus: (status) => status === 204,
      });
      return;
    },
    {
      onMutate: async ({ roomId }) => {
        const qk = [...queryKey, roomId];
        await qc.cancelQueries(qk);

        let legalActions = undefined;
        let canSit = undefined;
        const pokerRoom = qc.getQueryData<PokerRooms.Get.ResBody>(qk);
        if (pokerRoom) {
          legalActions = popLegalActions(pokerRoom.table);
          canSit = pokerRoom.canSit;
          pokerRoom.canSit = false;
          qc.setQueryData(qk, pokerRoom);
        }
        return { legalActions, canSit, pokerRoom };
      },
      onError: (err, { roomId }, context) => {
        if (context?.pokerRoom) {
          const { pokerRoom, legalActions, canSit } = context;
          pushLegalActions(pokerRoom.table, legalActions);
          if (canSit !== undefined) {
            pokerRoom.canSit = canSit;
          }
          qc.setQueryData([...queryKey, roomId], pokerRoom);
        }
      },
      onSettled: (data, err, { roomId }) => {
        qc.invalidateQueries([...queryKey]);
      },
    }
  );
};

export default useAct;
