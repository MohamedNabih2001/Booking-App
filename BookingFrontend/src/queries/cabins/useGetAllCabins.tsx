import { useQuery } from "@tanstack/react-query";
import { getCabinsApi } from "../../api/cabin/getCabin";

function useGetAllCabins({ filter }: { filter: string | null }) {
  const {
    data: cabinsData,
    isLoading: isLoadingCabins,
    error: errorCabins,
  } = useQuery({
    queryKey: ["cabins", filter],
    queryFn: async () => {
      const res = await getCabinsApi({ filter });
      return res;
    },
  });
  return {
    data: cabinsData,
    isLoading: isLoadingCabins,
    error: errorCabins,
  };
}

export default useGetAllCabins;
