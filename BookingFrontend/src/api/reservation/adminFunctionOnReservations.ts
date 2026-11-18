import type {
  ReservationGetResponseType,
  ResponseMessageType,
} from "../../types/reservationType";
import { apiBooking } from "../axios";

export const deleteReservationAdminApi = async ({
  id,
}: {
  id: string;
}): Promise<ResponseMessageType> => {
  const res = await apiBooking.delete(`/reservation/${id}/admin`);
  return res.data as ResponseMessageType;
};
////////////////////////////////////////
export const cancelReservationAdminApi = async ({
  id,
}: {
  id: string;
}): Promise<ReservationGetResponseType> => {
  const res = await apiBooking.put(`/reservation/${id}/admin`);
  return res.data as ReservationGetResponseType;
};
