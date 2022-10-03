import { PokerRooms } from "@pokester/common-api";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { path, queryKey } from "./config";

const useGet = (roomId: string) =>
  useQuery<PokerRooms.Get.ResBody, AxiosError<string>>(
    [...queryKey, roomId],
    async () => {
      const { data } = await axios.get<PokerRooms.Get.ResBody>(
        `${path}/${roomId}`,
        { validateStatus: (status) => status === 200 }
      );
      return data;
    },
    { refetchInterval: 1000, refetchIntervalInBackground: true }
  );

export default useGet;
