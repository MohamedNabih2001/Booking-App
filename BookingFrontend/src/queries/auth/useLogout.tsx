import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatchBooking } from "../../Redux/hook";
import { logout } from "../../Redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../../api/auth/logout";

function useLogout() {
  const dispatch = useAppDispatchBooking();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: logoutApp,
    isPending: isLogingout,
    error: logoutError,
  } = useMutation({
    mutationFn: async () => {
      const res = await logoutApi();
      return res;
    },
    onSuccess: () => {
      dispatch(logout());
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Log out successfully");
      navigate("/");
    },
    onError: (err) => {
      toast.error(`Log out failed : ${err.message}`);
    },
  });
  return {
    mutate: logoutApp,
    isPending: isLogingout,
    error: logoutError,
  };
}

export default useLogout;
