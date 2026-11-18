import { useQuery } from "@tanstack/react-query";
import { getCabinApi } from "../../api/cabin/getCabin";

function useGetCabin({ id }: { id: string | undefined }) {
  const {
    data: cabinData,
    isLoading: isLoadingCabin,
    error: errorCabin,
  } = useQuery({
    queryKey: [`cabins-${id}`],
    queryFn: async () => {
      if (id) {
        const res = await getCabinApi({ id });
        return res;
      } else {
        return;
      }
    },
  });
  return {
    data: cabinData,
    isLoading: isLoadingCabin,
    error: errorCabin,
  };
}

export default useGetCabin;
