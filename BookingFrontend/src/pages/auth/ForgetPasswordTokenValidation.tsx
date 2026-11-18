import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useCheckTokenRP from "../../queries/mail/useCheckTokenRP";
import validator from "validator";
import useResetNewPassword from "../../queries/mail/useResetNewPassword";

function ForgetPasswordTokenValidation() {
  const [newPassword, setPassword] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean | null>(
    null,
  );
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [didRun, setDidRun] = useState(false);
  const {
    mutate: checkTokenRP,
    data: dataChecking,
    isPending: isChecking,
    error: errorCheckingToken,
  } = useCheckTokenRP();
  const {
    mutate: resetPassword,
    isPending: isReseting,
    error: errorResetingEmail,
  } = useResetNewPassword();

  useEffect(() => {
    if (token && didRun === false) {
      setDidRun(true);
      try {
        checkTokenRP({ token });
        setShowPasswordForm(true);
      } catch (err) {
        setShowPasswordForm(false);
      }
    }
  }, [token, didRun]);
  console.log(dataChecking);

  useEffect(() => {
    if (token && didRun === true) {
      if (dataChecking?.data.validation === true) {
        setShowPasswordForm(true);
      } else {
        setShowPasswordForm(false);
      }
    }
  }, [token, didRun, dataChecking]);

  function setNewPassword() {
    if (newPassword) {
      const isStrong = validator.isStrongPassword(newPassword);
      if (token && isStrong) {
        resetPassword({ password: newPassword, token });
      }
    }
  }
  return (
    <div className="w-full h-screen overflow-x-hidden overflow-y-auto pt-25 p-2">
      <div className="w-full flexColCenter gap-4 text-2xl font-semibold uppercase font-special">
        {isChecking ? "is Checking token" : "checked token"}
        {showPasswordForm &&
          dataChecking &&
          dataChecking?.data.validation === true && (
            <div className="w-full flexColCenter gap-4 text-2xl font-semibold uppercase font-special">
              <p className="capitalize font-sans text-md">
                {dataChecking.message}
              </p>
              <h2 className="capitalize font-sans  text-2xl">
                Enter your new password
              </h2>
              <input
                className="border-2 font-sans p-1 text-sm px-3 rounded-2xl"
                type="text"
                placeholder="enter password . . ."
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => {
                  setNewPassword();
                }}
                disabled={!newPassword || isReseting}
                className="bg-green-500 disableBtn text-sm p-1.5 rounded-2xl cursor-pointer hover:bg-green-700 animation text-white font-semibold capitalize"
              >
                Set New Password
              </button>
            </div>
          )}
        {dataChecking && dataChecking?.data.validation === false && (
          <div className="w-full flexColCenter gap-4 text-2xl font-semibold uppercase font-special">
            <h2 className="captailize font-sans  text-2xl">
              {dataChecking.message}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgetPasswordTokenValidation;
