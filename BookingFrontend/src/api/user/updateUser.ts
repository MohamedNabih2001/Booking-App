import type { ResponseUserType } from "../../types/userTypes";
import { apiBooking } from "../axios";

export interface UserPersonalDataType {
  name?: string;
  theme?: string;
  role?: string;
}
export interface UserPasswordDataType {
  password: string;
  oldPassword: string;
}
export interface UserFromAdminDataType {
  role: string;
}
export const updateUserApi = async ({
  data,
}: {
  data: UserPasswordDataType | UserPersonalDataType;
}): Promise<ResponseUserType> => {
  const res = await apiBooking.put(`/user/`, data);
  return res.data as ResponseUserType;
};

////////////////
export const updateUserFromAdminApi = async ({
  data,
  id,
}: {
  data: UserFromAdminDataType;
  id: string;
}): Promise<ResponseUserType> => {
  const res = await apiBooking.put(`/user/${id}`, data);
  return res.data as ResponseUserType;
};
