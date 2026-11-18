import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelReservationApi } from "../../api/reservation/confirmOrCancelReservations";
import { toast } from "react-toastify";

function useCancelReservations() {
  const queryClient = useQueryClient();
  const {
    mutate: cancelReservation,
    isPending: isCanceling,
    error: errorCancel,
  } = useMutation({
    mutationFn: async ({ id }: { id: string | undefined }) => {
      if (!id) return;
      const res = await cancelReservationApi({ id });
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
    mutate: cancelReservation,
    isPending: isCanceling,
    error: errorCancel,
  };
}

export default useCancelReservations;
