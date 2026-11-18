import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteReservationAdminApi } from "../../api/reservation/adminFunctionOnReservations";

function useDeleteReservations() {
  const queryClient = useQueryClient();
  const {
    mutate: deleteReservation,
    isPending: isDeletingReservation,
    error: errorDeleteReservation,
  } = useMutation({
    mutationFn: async ({ id }: { id: string | undefined }) => {
      if (!id) return;
      const res = await deleteReservationAdminApi({ id });
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations-user"] });
      toast.success(res?.message);
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
  return {
    mutate: deleteReservation,
    isPending: isDeletingReservation,
    error: errorDeleteReservation,
  };
}

export default useDeleteReservations;
