import type {
  ResponseUsersType,
  ResponseUserType,
} from "../../types/userTypes";
import { apiBooking } from "../axios";

export const getUserApi = async (): Promise<ResponseUserType> => {
  const res = await apiBooking.get("/user/");
  return res.data as ResponseUserType;
};

//////////////////////////////////

export const getUsersApi = async ({
  searchName,
}: {
  searchName?: string | null;
}): Promise<ResponseUsersType> => {
  const res = await apiBooking.get("/user/all", {
    params: {
      searchName,
    },
  });
  return res.data as ResponseUsersType;
};
