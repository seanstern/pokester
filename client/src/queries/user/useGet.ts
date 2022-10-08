import { User } from "@pokester/common-api";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { queryKey, path } from "./config";

const useGet = () =>
  useQuery<User.Get.ResBody, AxiosError<string>>(queryKey, async () => {
    const { data } = await axios.get<User.Get.ResBody>(path, {
      validateStatus: (status) => status === 200,
    });
    return data;
  });

export default useGet;
