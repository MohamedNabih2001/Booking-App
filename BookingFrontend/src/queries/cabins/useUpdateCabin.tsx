import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCabinApi } from "../../api/cabin/createCabin";
import { toast } from "react-toastify";

function useUpdateCabin() {
  const queryClient = useQueryClient();
  const {
    mutate: updateCabin,
    isPending: isUpdatingCabin,
    error: errorUpdatingCabin,
  } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | undefined;
      data: FormData;
    }) => {
      if (id) {
        const res = await updateCabinApi({ data, id });
        return res;
      } else return;
    },
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: ["cabins"] });
        queryClient.invalidateQueries({ queryKey: [`cabins-${res.data._id}`] });
        toast.success(res.message);
      }
    },
    onError: (err) => {
      console.log(err);
      toast.error("Failed create cabin");
    },
  });

  return {
    mutate: updateCabin,
    isPending: isUpdatingCabin,
    error: errorUpdatingCabin,
  };
}

export default useUpdateCabin;
