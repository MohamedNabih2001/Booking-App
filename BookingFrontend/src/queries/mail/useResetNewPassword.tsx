import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { resetNewPasswordApi } from "../../api/mail/resetNewPassword";
import { useNavigate } from "react-router-dom";

function useResetNewPassword() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    mutate: resetPassword,
    isPending: isReseting,
    error: errorResetingEmail,
  } = useMutation({
    mutationFn: async ({
      password,
      token,
    }: {
      password: string;
      token: string;
    }) => {
      const res = await resetNewPasswordApi({ password, token });
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setTimeout(() => {
        navigate("/");
      }, 300);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return {
    mutate: resetPassword,
    isPending: isReseting,
    error: errorResetingEmail,
  };
}

export default useResetNewPassword;
