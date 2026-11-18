import { useQuery } from "@tanstack/react-query";
import { getReservationsApi } from "../../api/reservation/getReservations";

function useGetAllReservatoins({ searchName }: { searchName: string | null }) {
  const {
    data: allReservationData,
    isLoading: isLoadingReservations,
    error: errorReservations,
  } = useQuery({
    queryKey: ["reservations", searchName],
    queryFn: async () => {
      const res = await getReservationsApi({ searchName });
      return res;
    },
  });
  return {
    data: allReservationData,
    isLoading: isLoadingReservations,
    error: errorReservations,
  };
}

export default useGetAllReservatoins;
