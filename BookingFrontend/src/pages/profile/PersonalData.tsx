import { Moon, Sun } from "lucide-react";
import useGetUser from "../../queries/user/useGetUser";
import useUpdateUser from "../../queries/user/useUpdateUser";
import { cn } from "../../lib/utils";
import useLogout from "../../queries/auth/useLogout";

function PersonalData() {
  const {
    data: userData,
    isLoading: isLoadingUserData,
    error: errorUserData,
  } = useGetUser();

  const {
    mutate: logoutApp,
    isPending: isLogingout,
    error: logoutError,
  } = useLogout();

  const {
    mutate: updateUserData,
    isPending: isUpdatingUserData,
    error: errorUpdatingUserData,
  } = useUpdateUser();

  function updateName(e: React.FocusEvent<HTMLInputElement, Element>) {
    if (userData && userData.data._id) {
      updateUserData({
        data: {
          name: String(e.target.value),
        },
      });
    }
  }
  function changeTheme() {
    if (userData && userData.data._id) {
      const theme = userData.data.theme === "light" ? "dark" : "light";
      updateUserData({
        data: {
          theme,
        },
      });
    }
  }
  const dataUnchangable = [
    { name: "Email", id: "email", value: userData?.data.email },
    { name: "Role", id: "role", value: userData?.data.role },
  ];
  return (
    <div className="w-full h-full p-1 flex flex-col gap-4 items-center justify-start">
      <div className="w-full flexCenter p-1">
        <span className="font-semibold font-special text-lg md:text-2xl">
          Personal Data
        </span>
      </div>
      <div className="md:w-[70%] w-full p-1 flex flex-col gap-2 items-center justify-start">
        <div className="w-full p-1 flex flex-col md:flex-row items-start justify-start md:items-center gap-2 ">
          <label className="md:w-[30%] w-full p-1" htmlFor="name">
            Name :
          </label>
          <input
            className="w-full p-1 px-2 bg-gray-100 rounded-2xl"
            id="name"
            disabled={isLoadingUserData || isUpdatingUserData}
            defaultValue={userData?.data.name}
            type="text"
            onBlur={updateName}
          />
        </div>
        <div className="w-full p-1 flex flex-col md:flex-row items-start justify-start md:items-center gap-2 ">
          <label className="md:w-[30%] w-full p-1" htmlFor="theme">
            Theme :
          </label>
          <span
            onClick={changeTheme}
            className={cn(
              " p-1 px-2 border-gray-100 cursor-pointer border-2 rounded-2xl hover:bg-gray-100 hover:scale-110 animation",
              (isLoadingUserData || isUpdatingUserData) &&
                "pointer-events-none",
            )}
            id="theme"
          >
            {userData?.data.theme === "light" ? <Moon /> : <Sun />}
          </span>
        </div>
        <div className="w-full text-gray-700 p-1 flex flex-col md:flex-row items-start justify-start md:items-center gap-2 ">
          <label className="md:w-[30%] w-full p-1" htmlFor="theme">
            E-mail :
          </label>
          <span
            className=" p-1 w-full px-2 border-gray-100 border-2 rounded-2xl "
            id="theme"
          >
            {userData?.data.email}
          </span>
        </div>
        <div className="w-full text-gray-700 p-1 flex flex-col md:flex-row items-start justify-start md:items-center gap-2 ">
          <label className="md:w-[30%] w-full p-1" htmlFor="theme">
            Role :
          </label>
          <span
            className=" p-1 w-full px-2 border-gray-100 border-2 rounded-2xl "
            id="theme"
          >
            {userData?.data.role}
          </span>
        </div>
        <div className="w-full text-gray-700 p-1 flexCenter gap-2 ">
          <span
            onClick={() => logoutApp()}
            className={cn(
              " p-1 px-2 text-white font-semibold bg-red-700 hover:bg-red-500  animation hover:scale-110 cursor-pointer rounded-2xl ",
              (isLoadingUserData || isUpdatingUserData || isLogingout) &&
                "pointer-events-none bg-gray-700 ",
            )}
          >
            Log out
          </span>
        </div>
      </div>
    </div>
  );
}

export default PersonalData;
