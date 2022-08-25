import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { PokerRooms } from "@pokester/common-api";
import popLegalActions, {
  LegalActions,
} from "./mutation-utils/LegalActionsPopper";
import pushLegalActions from "./mutation-utils/LegalActionsPusher";

const PATH = "/api/rooms";

export const useGetAll = (query: PokerRooms.GetAll.ReqQuery) =>
  useQuery(["api", "rooms", query], async () => {
    const { data } = await axios.get<PokerRooms.GetAll.ResBody>(PATH, {
      params: query,
      validateStatus: (status) => status === 200,
    });
    return data;
  });

export const useGet = (roomId: string) =>
  useQuery(
    ["api", "rooms", roomId],
    async () => {
      const { data } = await axios.get<PokerRooms.Get.ResBody>(
        `${PATH}/${roomId}`,
        {
          validateStatus: (status) => status === 200,
        }
      );
      return data;
    },
    { refetchInterval: 1000, refetchIntervalInBackground: true }
  );

export const useCreate = () => {
  const qc = useQueryClient();

  return useMutation(
    async (reqBody: PokerRooms.Create.ReqBody) => {
      const { data } = await axios.post<PokerRooms.Create.ResBody>(
        PATH,
        reqBody,
        {
          validateStatus: (status) => status === 201,
        }
      );
      return data;
    },
    { onSuccess: () => qc.invalidateQueries(["api", "rooms"]) }
  );
};

type ActParam = {
  roomId: string;
  data: PokerRooms.Act.ReqBody;
};
type ActContext = {
  pokerRoom?: PokerRooms.Get.ResBody;
  legalActions?: LegalActions;
  canSit?: boolean;
};
export const useAct = () => {
  const qc = useQueryClient();

  return useMutation<void, unknown, ActParam, ActContext>(
    async ({ roomId, data }: ActParam): Promise<void> => {
      await axios.patch<undefined>(`${PATH}/${roomId}`, data, {
        validateStatus: (status) => status === 204,
      });
      return;
    },
    {
      onMutate: async ({ roomId }) => {
        const qk = ["api", "rooms", roomId];
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
          qc.setQueryData(["api", "rooms", roomId], pokerRoom);
        }
      },
      onSettled: (data, err, { roomId }) => {
        qc.invalidateQueries(["api", "rooms"]);
      },
    }
  );
};
