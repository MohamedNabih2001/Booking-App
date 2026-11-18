import useUpdateUserFromAdmin from "../../queries/user/useUpdateUserFromAdmin";
import type { UserType } from "../../types/userTypes";
function UserAdminBlock({ data }: { data: UserType }) {
  const {
    mutate: updateUserDataFromAdmin,
    isPending: isUpdatingUserDataFromData,
    error: errorUpdatingUserDataFromAdmin,
  } = useUpdateUserFromAdmin();

  function makeAdmin() {
    if (data)
      updateUserDataFromAdmin({ data: { role: "admin" }, id: data._id });
  }

  //////////////////////

  function makeUser() {
    if (data) updateUserDataFromAdmin({ data: { role: "user" }, id: data._id });
  }

  return (
    <div className="p-1 w-70 border overflow-hidden  rounded-2xl flexBetween">
      <div className="w-full h-50  flex flex-col items-center justify-start">
        <div className="h-35 w-full">
          <img
            src={data.role === "user" ? "/user/user.png" : "/user/admin.png"}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="h-15 w-full flexColCenter gap-2 text-sm tracking-wide text-center font-semibold capitalize">
          <span>{data.name}</span>
          <span className="lowercase  text-[10px]">
            @{data.email.split("@")[0]}
          </span>
        </div>
      </div>
      <div className="w-full h-50 flexColCenter gap-3 ">
        <div className="w-full flexCenter p-1 ">
          <span className=" text-md tracking-wide text-center font-semibold capitalize ">
            {data.role === "user" ? "user" : "admin"}
          </span>
        </div>
        <div className="w-full flexCenter p-1 ">
          {data.role === "user" ? (
            <button
              disabled={isUpdatingUserDataFromData}
              onClick={() => makeAdmin()}
              className=" text-sm disableBtn tracking-wide p-1 rounded-2xl hover:bg-green-500 hover:scale-110 animation text-center font-semibold capitalize bg-green-600 cursor-pointer text-white dark:text-black "
            >
              Be Admin
            </button>
          ) : (
            <button
              disabled={isUpdatingUserDataFromData}
              onClick={() => makeUser()}
              className=" text-sm disableBtn tracking-wide p-1 rounded-2xl hover:bg-red-500 hover:scale-110 animation text-center font-semibold capitalize bg-red-600 cursor-pointer text-white dark:text-black "
            >
              Remove Admin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAdminBlock;
