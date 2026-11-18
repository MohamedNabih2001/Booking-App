import { useMutation } from "@tanstack/react-query";
import { sendEmailForgetPasswordApi } from "../../api/mail/forgetPassword";
import { toast } from "react-toastify";

function useForgetPasswordMail() {
  const {
    mutate: sendEmailForgetPassword,
    isPending: isSending,
    error: errorSendingEmail,
  } = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await sendEmailForgetPasswordApi({ email });
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
    mutate: sendEmailForgetPassword,
    isPending: isSending,
    error: errorSendingEmail,
  };
}

export default useForgetPasswordMail;
