import type { RefereshResponseType } from "../../types/userTypes";
import { apiBooking } from "../axios";

export type SigninDataInputType = {
  email: string;
  password: string;
};

//////////////////////////////////

export async function signinApi(
  data: SigninDataInputType,
): Promise<RefereshResponseType> {
  const res = await apiBooking.put("/auth/signin", data);

  return res.data as RefereshResponseType;
}
