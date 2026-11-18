import type { ResponseMessageType } from "../../types/reservationType";
import { apiBooking } from "../axios";

export const resetNewPasswordApi = async ({
  password,
  token,
}: {
  password: string;
  token: string;
}): Promise<ResponseMessageType> => {
  const res = await apiBooking.put("/mail/resetNewPassword", {
    password,
    token,
  });
  return res.data as ResponseMessageType;
};
