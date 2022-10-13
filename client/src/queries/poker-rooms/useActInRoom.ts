import { PokerRooms } from "@pokester/common-api";
import useAct from "./useAct";

const useActInRoom = (roomId: string) => {
  const { mutate, mutateAsync, ...rest } = useAct();
  const mutateRoom = (action: PokerRooms.Act.ReqBody) =>
    mutate({ roomId, data: action });
  const mutateRoomAsync = (action: PokerRooms.Act.ReqBody) => {
    mutateAsync({ roomId, data: action });
  };
  return { mutate: mutateRoom, mutateAsync: mutateRoomAsync, ...rest };
};

export type ActInRoomMutation = ReturnType<typeof useActInRoom>;

export default useActInRoom;
