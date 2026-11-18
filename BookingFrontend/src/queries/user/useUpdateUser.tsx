import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUserApi,
  type UserPasswordDataType,
  type UserPersonalDataType,
} from "../../api/user/updateUser";
import { toast } from "react-toastify";
import { useAppDispatchBooking } from "../../Redux/hook";
import { changeTheme, signin } from "../../Redux/userSlice";

function useUpdateUser() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatchBooking();

  const {
    mutate: updateUserData,
    isPending: isUpdatingUserData,
    error: errorUpdatingUserData,
  } = useMutation({
    mutationFn: async ({
      data,
    }: {
      data: UserPasswordDataType | UserPersonalDataType;
    }) => {
      const res = await updateUserApi({ data });
      return res;
    },
    onSuccess: (res) => {
      const dataSigninApp = {
        name: res.data.name,
        role: res.data.role,
        theme: res.data.theme,
      };
      dispatch(changeTheme(dataSigninApp));
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Update data successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return {
    mutate: updateUserData,
    isPending: isUpdatingUserData,
    error: errorUpdatingUserData,
  };
}

export default useUpdateUser;
