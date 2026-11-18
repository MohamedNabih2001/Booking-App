import type { ResponseMessageType } from "../../types/reservationType";
import { apiBooking } from "../axios";

export const sendEmailForgetPasswordApi = async ({
  email,
}: {
  email: string;
}): Promise<ResponseMessageType> => {
  const res = await apiBooking.put("/mail/send", { email });
  return res.data as ResponseMessageType;
};
