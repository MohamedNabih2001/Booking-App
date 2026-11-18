import type { ResponseResetPasseordValidation } from "../../types/mailType";
import { apiBooking } from "../axios";

export const checkTokenResetPasswordApi = async ({
  token,
}: {
  token: string;
}): Promise<ResponseResetPasseordValidation> => {
  const res = await apiBooking.put("/mail/validate", { token });
  return res.data as ResponseResetPasseordValidation;
};
