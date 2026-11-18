import type {
  ResponseCabinsType,
  ResponseCabinType,
} from "../../types/cabinTypes";
import { apiBooking } from "../axios";

interface PropsCabinsType {
  filter: string | null;
}
export const getCabinsApi = async ({
  filter,
}: PropsCabinsType): Promise<ResponseCabinsType> => {
  const res = await apiBooking.get(`/cabin${filter ? filter : ""}`);
  return res.data as ResponseCabinsType;
};

/////////////////////////////////////////////

export const getCabinApi = async ({
  id,
}: {
  id: string;
}): Promise<ResponseCabinType> => {
  const res = await apiBooking.get(`/cabin/${id}`);
  return res.data as ResponseCabinType;
};
