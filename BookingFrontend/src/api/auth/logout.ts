import type { MessageResponseType } from "../../types/userTypes";
import { apiBooking } from "../axios";

//////////////////////////////////

export async function logoutApi(): Promise<MessageResponseType> {
  const res = await apiBooking.put("/auth/logout");

  return res.data as MessageResponseType;
}
