import { useQuery } from "@tanstack/react-query";
import { getUsersApi } from "../../api/user/getUser";
function useGetUsers({ searchName }: { searchName: string | null }) {
  const {
    data: usersData,
    isLoading: isLoadingUsersData,
    error: errorUsersData,
  } = useQuery({
    queryKey: ["users", searchName],
    queryFn: async () => {
      if (searchName) {
        const res = await getUsersApi({ searchName });
        return res;
      } else {
        const res = await getUsersApi({});
        return res;
      }
    },
  });
  return {
    data: usersData,
    isLoading: isLoadingUsersData,
    error: errorUsersData,
  };
}

export default useGetUsers;
