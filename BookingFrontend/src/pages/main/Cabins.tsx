import { Link, useSearchParams } from "react-router-dom";
import CabinsFilter from "../../components/cabins/CabinsFilter";
import useGetAllCabins from "../../queries/cabins/useGetAllCabins";
import Spinner from "../../components/global/Spinner";
import { cn } from "../../lib/utils";
import CabinItem from "../../components/cabins/CabinItem";

function Cabins() {
  const [searchParams] = useSearchParams();
  const filterString =
    searchParams.toString().length > 0 ? `?${searchParams.toString()}` : null;
  const {
    data: cabinsData,
    isLoading: isLoadingCabins,
    error: errorCabins,
  } = useGetAllCabins({
    filter: filterString,
  });
  return (
    <div className=" p-2 pt-25 w-full h-screen flex flex-col overflow-hidden items-center justify-center">
      <div className=" w-full p-2 flex flex-col items-center justify-center gap-2 ">
        <h2 className="font-special capitalize font-semibold text-lg md:text-3xl">
          All Cabins
        </h2>
        <h3 className="font-special capitalize font-semibold text-sm text-center md:text-2xl">
          find cabin & discover world
        </h3>
      </div>
      <div
        className={cn(
          "w-full h-full flex items-center   overflow-hidden gap-2",
          "flex-col justify-center ",
          " md:flex-row md:justify-start  ",
        )}
      >
        <CabinsFilter />
        {isLoadingCabins && <Spinner />}
        {isLoadingCabins === false && (
          <div className="w-full overflow-x-hidden p-2 overflow-y-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full gap-3">
            {cabinsData &&
              cabinsData.data.map((cabin, i) => {
                return <CabinItem data={cabin} key={i} />;
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cabins;
