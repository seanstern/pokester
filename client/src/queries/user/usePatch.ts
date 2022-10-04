import { useQueryClient, useMutation } from "react-query";
import { User } from "@pokester/common-api";
import axios, { AxiosError } from "axios";
import { path, queryKey } from "./config";

const usePatch = () => {
  const qc = useQueryClient();

  return useMutation<void, AxiosError<string>, User.Patch.ReqBody>(
    async (reqBody: User.Patch.ReqBody) => {
      await axios.patch<never>(path, reqBody, {
        validateStatus: (status) => status === 204,
      });
      return;
    },
    { onSuccess: () => qc.invalidateQueries(queryKey) }
  );
};

export default usePatch;
