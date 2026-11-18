import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabinApi } from "../../api/cabin/createCabin";
import { toast } from "react-toastify";

function useCreateCabin() {
  const queryClient = useQueryClient();
  const {
    mutate: createCabin,
    isPending: isCreatingCabin,
    error: errorCreatingCabin,
  } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await createCabinApi({ data });
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      toast.success(res.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Failed create cabin");
    },
  });

  return {
    mutate: createCabin,
    isPending: isCreatingCabin,
    error: errorCreatingCabin,
  };
}

export default useCreateCabin;
