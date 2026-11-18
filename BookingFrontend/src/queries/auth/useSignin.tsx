import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signinApi, type SigninDataInputType } from "../../api/auth/signin";
import { useAppDispatchBooking } from "../../Redux/hook";
import { signin } from "../../Redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function useSignin() {
  const dispatch = useAppDispatchBooking();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    mutate: signinApp,
    isPending: isSigningin,
    error: siginError,
  } = useMutation({
    mutationFn: async (data: SigninDataInputType) => {
      const res = await signinApi(data);
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
      dispatch(signin(dataSigninApp));
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Sign in successfully");

      navigate("/");
    },
    onError: (err) => {
      toast.error(`Sign in failed : ${err.message}`);
    },
  });
  return {
    mutate: signinApp,
    isPending: isSigningin,
    error: siginError,
  };
}

export default useSignin;
