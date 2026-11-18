import CabinAdminItem from "../../components/cabins/CabinAdminItem";
import useGetAllCabins from "../../queries/cabins/useGetAllCabins";

function ShowCabins() {
  const filter = null;
  const {
    data: cabinsData,
    isLoading: isLoadingCabins,
    error: errorCabins,
  } = useGetAllCabins({ filter });
  return (
    <div className="w-full h-full p-2 flexColCenter gap-4">
      {cabinsData?.data.map((item, i) => {
        return <CabinAdminItem data={item} key={i} />;
      })}
    </div>
  );
}

export default ShowCabins;
