import { useQuery } from "@tanstack/react-query";
import { getUserApi } from "../../api/user/getUser";

function useGetUser() {
  const {
    data: userData,
    isLoading: isLoadingUserData,
    error: errorUserData,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUserApi,
  });
  return {
    data: userData,
    isLoading: isLoadingUserData,
    error: errorUserData,
  };
}

export default useGetUser;
