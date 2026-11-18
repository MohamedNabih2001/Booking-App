import type { ReservationResponseType } from "../../types/reservationType";
import { apiBooking } from "../axios";

interface DataType {
  startDate: string;
  endDate: string;
}

export const createReservationApi = async ({
  data,
  id,
}: {
  id: string;
  data: DataType;
}): Promise<ReservationResponseType> => {
  const res = await apiBooking.post(`/reservation/cabin/${id}`, data);
  return res.data as ReservationResponseType;
};
