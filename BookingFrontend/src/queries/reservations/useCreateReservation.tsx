import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createReservationApi } from "../../api/reservation/createReservation";

interface DataType {
  startDate: string;
  endDate: string;
}

function useCreateReservation() {
  const queryClient = useQueryClient();
  const {
    mutate: createReservation,
    isPending: isCreatingReservation,
    error: errorCreatingReservation,
  } = useMutation({
    mutationFn: async ({ data, id }: { data: DataType; id: string }) => {
      const res = await createReservationApi({ data, id });
      return res;
    },
    onSuccess: async (res) => {
      toast.success(
        "Reservatoin is created successfully, Transfering now to Payment page please wait . . . . .  ",
      );
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setTimeout(() => {
        window.location.assign(res.paymentUrl);
      }, 2000);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Failed create reservation");
    },
  });

  return {
    mutate: createReservation,
    isPending: isCreatingReservation,
    error: errorCreatingReservation,
  };
}

export default useCreateReservation;
