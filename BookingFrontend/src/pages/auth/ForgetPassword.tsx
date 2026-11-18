import { useState } from "react";
import useForgetPasswordMail from "../../queries/mail/useForgetPasswordMail";

function ForgetPassword() {
  const [email, setEmail] = useState<string | null>(null);
  const {
    mutate: sendEmailForgetPassword,
    isPending: isSending,
    error: errorSendingEmail,
  } = useForgetPasswordMail();

  return (
    <div className="w-full h-screen overflow-x-hidden overflow-y-auto pt-25 p-2">
      <div className="w-full flexColCenter gap-4 text-2xl font-semibold uppercase font-special">
        <h2 className="captailize font-sans  text-2xl">Enter your email</h2>
        <input
          className="border-2 lowercase font-sans p-1 text-sm px-3 rounded-2xl"
          type="text"
          placeholder="enter email . . ."
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={() => {
            if (email) sendEmailForgetPassword({ email });
          }}
          disabled={!email || isSending}
          className="bg-green-500 disableBtn text-sm p-1.5 rounded-2xl cursor-pointer hover:bg-green-700 animation text-white font-semibold capitalize"
        >
          send token
        </button>
        <p className="capitalize font-sans text-sm">
          after click send token and recieve notification that token is sent
          please check your gmail
        </p>
      </div>
    </div>
  );
}

export default ForgetPassword;
