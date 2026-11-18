import type { ResponseCabinType } from "../../types/cabinTypes";
import { apiBooking } from "../axios";

export const createCabinApi = async ({
  data,
}: {
  data: FormData;
}): Promise<ResponseCabinType> => {
  const res = await apiBooking.post(`/cabin/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data as ResponseCabinType;
};

//////////////////////////////////////////////////////////////////////
export const updateCabinApi = async ({
  data,
  id,
}: {
  data: FormData;
  id: string;
}): Promise<ResponseCabinType> => {
  const res = await apiBooking.put(`/cabin/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
  return res.data as ResponseCabinType;
};

//////////////////////////////////////////////////////////////////////
