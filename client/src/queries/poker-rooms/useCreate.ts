import { PokerRooms } from "@pokester/common-api";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";
import { path, queryKey } from "./config";

const useCreate = () => {
  const qc = useQueryClient();

  return useMutation<
    PokerRooms.Create.ResBody,
    AxiosError<string>,
    PokerRooms.Create.ReqBody
  >(
    async (reqBody: PokerRooms.Create.ReqBody) => {
      const { data } = await axios.post<PokerRooms.Create.ResBody>(
        path,
        reqBody,
        { validateStatus: (status) => status === 201 }
      );
      return data;
    },
    { onSuccess: () => qc.invalidateQueries(queryKey) }
  );
};

export default useCreate;
