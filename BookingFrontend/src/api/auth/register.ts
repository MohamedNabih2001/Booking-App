import type { RefereshResponseType } from "../../types/userTypes";
import { apiBooking } from "../axios";

export type RegisterDataInputType = {
  email: string;
  name: string;
  passwordConfirm: string;
  password: string;
};

//////////////////////////////////

export async function registerApi(
  data: RegisterDataInputType,
): Promise<RefereshResponseType> {
  const res = await apiBooking.post("/auth/register", data);

  return res.data as RefereshResponseType;
}
