import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatchBooking } from "../../Redux/hook";
import { signin } from "../../Redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  registerApi,
  type RegisterDataInputType,
} from "../../api/auth/register";

function useRegister() {
  const dispatch = useAppDispatchBooking();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: registerApp,
    isPending: isRegistering,
    error: registerError,
  } = useMutation({
    mutationFn: async (data: RegisterDataInputType) => {
      const res = await registerApi(data);
      return res;
    },
    onSuccess: (res) => {
      const dataSigninApp = {
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: res.data.token,
        theme: res.data.theme,
      };
      queryClient.invalidateQueries({ queryKey: ["user"] });

      dispatch(signin(dataSigninApp));
      toast.success("Register successfully");
      navigate("/");
    },
    onError: (err) => {
      console.log(err);
      toast.error(`Register failed : ${err.message}`);
    },
  });
  return {
    mutate: registerApp,
    isPending: isRegistering,
    error: registerError,
  };
}

export default useRegister;
