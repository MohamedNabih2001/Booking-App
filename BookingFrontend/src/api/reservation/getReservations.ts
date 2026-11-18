import type {
  ReservationGetResponseType,
  ReservationsGetResponseType,
} from "../../types/reservationType";
import { apiBooking } from "../axios";

export const getReservationsApi = async ({
  searchName,
}: {
  searchName: string | null;
}): Promise<ReservationsGetResponseType> => {
  const res = await apiBooking.get(`/reservation/`, {
    params: {
      id: searchName,
    },
  });
  return res.data as ReservationsGetResponseType;
};

//////////////////////////////////////////////////////////////

export const getUserReservationsApi =
  async (): Promise<ReservationsGetResponseType> => {
    const res = await apiBooking.get(`/reservation/user`);
    return res.data as ReservationsGetResponseType;
  };

//////////////////////////////////////////////////////////////

export const getReservationApi = async ({
  id,
}: {
  id: string;
}): Promise<ReservationGetResponseType> => {
  const res = await apiBooking.get(`/reservation/${id}`);
  return res.data as ReservationGetResponseType;
};
