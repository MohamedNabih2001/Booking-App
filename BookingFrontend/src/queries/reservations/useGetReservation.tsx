import { useQuery } from "@tanstack/react-query";
import { getReservationApi } from "../../api/reservation/getReservations";

function useGetReservation({ id }: { id: string | undefined }) {
  const {
    data: reservationDate,
    isLoading: isLoadingReservation,
    error: errorReservation,
  } = useQuery({
    queryKey: [`reservation-${id}`],
    queryFn: async () => {
      if (id) {
        const res = await getReservationApi({ id });
        return res;
      } else {
        return;
      }
    },
  });
  return {
    data: reservationDate,
    isLoading: isLoadingReservation,
    error: errorReservation,
  };
}

export default useGetReservation;
