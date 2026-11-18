import { useState } from "react";
import Spinner from "../../components/global/Spinner";
import UserAdminBlock from "../../components/users/UserAdminBlock";
import useGetUsers from "../../queries/user/useGetUsers";

function AdminUsers() {
  const [searchName, setSearchName] = useState<string | null>(null);
  const {
    data: usersData,
    isLoading: isLoadingUsersData,
    error: errorUsersData,
  } = useGetUsers({ searchName });

  function debounce<T extends (text: string) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return function (text: string) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(text);
      }, delay);
    };
  }
  const handleSearch = debounce((text: string) => {
    setSearchName(text);
  }, 500);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-4">
      <div className="w-full flex flex-col items-center justify-start gap-4">
        <div className="w-full p-2 flexBetween ">
          <h2 className="font-semibold font-special text-2xl capitalize">
            Users
          </h2>
          <input
            type="search"
            onChange={(e) => handleSearch(e.target.value)}
            className="border rounded-2xl focus:outline-2 focus:outline-gray-600 p-0.5 px-3 border-gray-600"
          />
        </div>
        <div className="w-[70%] bg-gray-600 h-px"></div>
      </div>
      {isLoadingUsersData && (
        <div className="w-full p-2  flex flex-row flex-wrap items-center justify-center gap-3 ">
          <Spinner />
        </div>
      )}
      {usersData && (
        <div className="w-full p-2  flex flex-row flex-wrap items-center justify-center gap-3 ">
          {usersData?.data.map((user, i) => {
            return <UserAdminBlock data={user} key={i} />;
          })}
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
