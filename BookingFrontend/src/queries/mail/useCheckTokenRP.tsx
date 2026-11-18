import { useMutation } from "@tanstack/react-query";
import { sendEmailForgetPasswordApi } from "../../api/mail/forgetPassword";
import { toast } from "react-toastify";
import { checkTokenResetPasswordApi } from "../../api/mail/checkTokenResetPassword";

function useCheckTokenRP() {
  const {
    mutate: checkTokenRP,
    data: dataChecking,
    isPending: isChecking,
    error: errorCheckingToken,
  } = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const res = await checkTokenResetPasswordApi({ token });
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return {
    mutate: checkTokenRP,
    data: dataChecking,
    isPending: isChecking,
    error: errorCheckingToken,
  };
}

export default useCheckTokenRP;
