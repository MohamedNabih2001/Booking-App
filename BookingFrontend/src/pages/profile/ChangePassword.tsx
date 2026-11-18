import { useRef } from "react";
import useUpdateUser from "../../queries/user/useUpdateUser";
import validator from "validator";

function ChangePassword() {
  const {
    mutate: updateUserData,
    isPending: isUpdatingUserData,
    error: errorUpdatingUserData,
  } = useUpdateUser();
  const passwordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  function updatePassword(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (passwordRef.current && newPasswordRef.current) {
      const isNewPasswordStrong = validator.isStrongPassword(
        newPasswordRef.current.value,
      );
      if (isNewPasswordStrong) {
        console.log(passwordRef.current.value, newPasswordRef.current.value);
        const password = newPasswordRef.current.value;
        const oldPassword = passwordRef.current.value;
        updateUserData({
          data: {
            password,
            oldPassword,
          },
        });
      } else {
        console.log("Please Enter valid Password");
      }
    }
  }

  return (
    <div className="w-full h-full p-1 flex flex-col gap-4 items-center justify-start">
      <div className="w-full flexCenter p-1">
        <span className="font-semibold font-special text-md md:text-2xl">
          Change Password
        </span>
      </div>
      <form
        onSubmit={updatePassword}
        className="md:w-[70%] w-full p-1 flex flex-col gap-2 items-center justify-start"
      >
        <div className="w-full p-1 flexStart gap-2 ">
          <label className="w-[40%] md:block hidden p-1" htmlFor="password">
            Old Password :
          </label>
          <input
            ref={passwordRef}
            className="w-full p-1 px-2 bg-gray-100 rounded-2xl"
            id="password"
            name="password"
            placeholder="Old Pasword . . . ."
            type="text"
          />
        </div>
        <div className="w-full p-1 flexStart gap-2 ">
          <label className="w-[40%] md:block hidden p-1" htmlFor="newPassword">
            New Password :
          </label>
          <input
            ref={newPasswordRef}
            name="newPassword"
            placeholder="New Password . . . ."
            className="w-full p-1 px-2 bg-gray-100  rounded-2xl"
            id="newPassword"
          />
        </div>
        <button
          disabled={isUpdatingUserData}
          className="bg-orange-700 cursor-pointer disableBtn text-md rounded-2xl text-white p-1 px-2 dark:text-black capitalize font-semibold tracking-wide"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
