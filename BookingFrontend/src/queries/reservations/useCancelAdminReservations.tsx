import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cancelReservationAdminApi } from "../../api/reservation/adminFunctionOnReservations";

function useCancelAdminReservations() {
  const queryClient = useQueryClient();
  const {
    mutate: cancelAdminReservation,
    isPending: isCancelingAdmin,
    error: errorCancelAdmin,
  } = useMutation({
    mutationFn: async ({ id }: { id: string | undefined }) => {
      if (!id) return;
      const res = await cancelReservationAdminApi({ id });
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations-user"] });
      queryClient.invalidateQueries({
        queryKey: [`reservation-${res?.data._id}`],
      });
      toast.success(res?.message);
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
  return {
    mutate: cancelAdminReservation,
    isPending: isCancelingAdmin,
    error: errorCancelAdmin,
  };
}

export default useCancelAdminReservations;
