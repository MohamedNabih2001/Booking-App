import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserFromAdminApi } from "../../api/user/updateUser";
import { toast } from "react-toastify";
import type { UserFromAdminDataType } from "../../api/user/updateUser";

function useUpdateUserFromAdmin() {
  const queryClient = useQueryClient();
  const {
    mutate: updateUserDataFromAdmin,
    isPending: isUpdatingUserDataFromData,
    error: errorUpdatingUserDataFromAdmin,
  } = useMutation({
    mutationFn: async ({
      data,
      id,
    }: {
      data: UserFromAdminDataType;
      id: string;
    }) => {
      const res = await updateUserFromAdminApi({ data, id });
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Update data successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return {
    mutate: updateUserDataFromAdmin,
    isPending: isUpdatingUserDataFromData,
    error: errorUpdatingUserDataFromAdmin,
  };
}

export default useUpdateUserFromAdmin;
