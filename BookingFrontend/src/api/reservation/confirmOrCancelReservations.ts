import type { ReservationGetResponseType } from "../../types/reservationType";
import { apiBooking } from "../axios";

export const confirmReservationApi = async ({
  id,
}: {
  id: string;
}): Promise<ReservationGetResponseType> => {
  const res = await apiBooking.put(`/reservation/${id}/confirm`);
  return res.data as ReservationGetResponseType;
};
////////////////////////////////////////
export const cancelReservationApi = async ({
  id,
}: {
  id: string;
}): Promise<ReservationGetResponseType> => {
  const res = await apiBooking.put(`/reservation/${id}/cancel`);
  return res.data as ReservationGetResponseType;
};
