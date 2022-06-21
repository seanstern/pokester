import axios from "axios";
import { useQuery } from "react-query";
import { Routes } from "@pokester/common-api";

const PATH = "/api/rooms";

export const useGetAll = (query: Routes.PokerRooms.GetAll.ReqQuery) =>
  useQuery([PATH, query], async () => {
    const { data } = await axios.get<Routes.PokerRooms.GetAll.ResBody>(PATH, {
      params: query,
      validateStatus: (status) => status === 200,
    });
    return data;
  });

export const useGet = (roomId: string) =>
  useQuery(
    `${PATH}/${roomId}`,
    async () => {
      const { data } = await axios.get<Routes.PokerRooms.Get.ResBody>(
        `${PATH}/${roomId}`,
        {
          validateStatus: (status) => status === 200,
        }
      );
      return data;
    },
    { refetchInterval: 1000, refetchIntervalInBackground: true }
  );
