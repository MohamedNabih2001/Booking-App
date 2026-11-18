import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmReservationApi } from "../../api/reservation/confirmOrCancelReservations";
import { toast } from "react-toastify";

function useConfirmReservations() {
  const queryClient = useQueryClient();
  const {
    mutate: confirmReservation,
    isPending: isConfirming,
    isSuccess,
    error: errorConfirm,
  } = useMutation({
    mutationFn: async ({ id }: { id: string | undefined }) => {
      if (!id) return;
      const res = await confirmReservationApi({ id });
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations-user"] });
      queryClient.invalidateQueries({
        queryKey: [`reservation-${res?.data._id}`],
      });
      toast.success(res?.message);
      console.log("3. onSuccess executed");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
  return {
    mutate: confirmReservation,
    isPending: isConfirming,
    isSuccess,
    error: errorConfirm,
  };
}

export default useConfirmReservations;
