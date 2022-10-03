import { PokerRooms } from "@pokester/common-api";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { path, queryKey } from "./config";

export const useGetAll = (query: PokerRooms.GetAll.ReqQuery) =>
  useQuery<PokerRooms.GetAll.ResBody, AxiosError<string>>(
    [...queryKey, query],
    async () => {
      const { data } = await axios.get<PokerRooms.GetAll.ResBody>(path, {
        params: query,
        validateStatus: (status) => status === 200,
      });
      return data;
    }
  );

export default useGetAll;
