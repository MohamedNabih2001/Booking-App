import { useQuery } from "@tanstack/react-query";
import { getUserReservationsApi } from "../../api/reservation/getReservations";

function useGetAllUserReservation() {
  const {
    data: userReservationData,
    isLoading: isLoadingUserReservation,
    error: errorUserReservations,
  } = useQuery({
    queryKey: ["reservations-user"],
    queryFn: async () => {
      const res = await getUserReservationsApi();
      return res;
    },
  });
  return {
    data: userReservationData,
    isLoading: isLoadingUserReservation,
    error: errorUserReservations,
  };
}

export default useGetAllUserReservation;
