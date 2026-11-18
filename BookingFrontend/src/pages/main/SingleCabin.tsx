import { Link, useParams } from "react-router-dom";
import useGetCabin from "../../queries/cabins/useGetCabin";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "../../components/global/Spinner";
import CabinImages from "../../components/cabins/CabinImages";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import useCreateReservation from "../../queries/reservations/useCreateReservation";

function SingleCabin() {
  const params = useParams();
  const id = params.cabinId;
  const {
    data: cabinData,
    isLoading: isLoadingCabin,
    error: errorCabin,
  } = useGetCabin({ id });

  const [range, setRange] = useState<DateRange | undefined>();

  const {
    mutate: createReservation,
    isPending: isCreatingReservation,
    error: errorCreatingReservation,
  } = useCreateReservation();

  function reserveCabin() {
    if (!range || !id) return;
    const startDate = new Date(String(range.from)).toISOString();
    const endDate = new Date(String(range.to)).toISOString();
    createReservation({ data: { startDate, endDate }, id });
  }
  const unAllowedRanges =
    cabinData?.data.reservationsDates.map((date) => {
      return { from: new Date(date.startDate), to: new Date(date.endDate) };
    }) || [];

  if (isLoadingCabin) {
    return <Spinner />;
  }
  if (cabinData) {
    return (
      <div className="w-full h-screen overflow-x-auto overflow-y-auto pt-25 p-2">
        <div className="w-full flexColCenter gap-4">
          <div className="w-full p-2 flexCenter">
            <h2 className="font-special font-semibold text-3xl uppercase text-orange-600">
              {cabinData?.data.name}
            </h2>
          </div>
          <div className="w-full p-2 flexBetween">
            <Link
              to="/cabins"
              className="bg-orange-700 hover:bg-orange-500 animation p-2 flexCenter gap-1 rounded-2xl shadow cursor-pointer text-white dark:text-black capitalize text-sm md:text-md"
            >
              <ChevronLeft /> <span>cabins</span>
            </Link>
            <Link
              to="/reservations"
              className="bg-orange-700 hover:bg-orange-500 animation p-2 flexCenter gap-1 rounded-2xl shadow cursor-pointer text-white dark:text-black capitalize text-sm md:text-md"
            >
              <span>reservations</span> <ChevronRight />
            </Link>
          </div>
          <CabinImages data={cabinData.data} />
          <div className="w-full p-2 flex items-center flex-col justify-center md:flex-row md:justify-start gap-2">
            <span className="capitalize font-semibold text-sm md:text-lg text-orange-600">
              Description :
            </span>
            <span className="capitalize font-semibold text-sm md:text-md text-gray-700">
              {cabinData.data.description}
            </span>
          </div>
          <div className="w-full   flex items-center flex-col justify-center md:flex-row md:justify-start  gap-3">
            <div className="w-full p-2  flex items-center flex-col justify-center md:flex-row md:justify-start  gap-2">
              <span className="capitalize font-semibold text-sm md:text-lg text-orange-600">
                Max Persons Number in cabin :
              </span>
              <span className="capitalize font-semibold text-sm md:text-md text-gray-700">
                {cabinData.data.maxPersonsNumber}
              </span>
            </div>
            <div className="w-full p-2  flex items-center flex-col justify-center md:flex-row md:justify-start  gap-2">
              <span className="capitalize font-semibold text-sm md:text-lg text-orange-600">
                price of cabin for one day :
              </span>
              <span className="capitalize font-semibold text-sm md:text-md text-gray-700">
                {cabinData.data.pricePerDay}$
              </span>
            </div>
          </div>
          <div className="w-full p-2  flex items-center flex-col justify-center md:flex-row md:justify-start  gap-2">
            <span className="capitalize font-semibold text-sm md:text-lg text-orange-600">
              Is it now allowing reservation ?{" "}
            </span>
            <span className="capitalize font-semibold text-sm md:text-md text-gray-700">
              {cabinData.data.isAllowed ? "yes" : "no"}
            </span>
          </div>
          <div className="w-full  flex items-center flex-col justify-center   gap-2">
            <div className="w-fit p-3 border-2 border-gray-300 rounded-2xl  flex items-center flex-col justify-center   gap-2">
              <span className="capitalize font-semibold text-sm md:text-lg text-blue-600">
                You can Reserve from here
              </span>
              <span className="w-[70%] h-0.5 bg-gray-300"></span>

              <DayPicker
                mode="range"
                selected={range}
                timeZone="UTC"
                onSelect={setRange}
                numberOfMonths={1}
                disabled={[{ before: new Date() }, ...unAllowedRanges]}
              />
              <span className="w-[70%] h-0.5 bg-gray-300"></span>
              <span className="p-2 text-sm">
                All Reservations by UTC timezone
              </span>
              <button
                disabled={isCreatingReservation}
                onClick={() => reserveCabin()}
                className="p-2 disableBtn text-white bg-blue-700 hover:bg-blue-500 cursor-pointer rounded-xl"
              >
                {isCreatingReservation ? "Reserving . . . ." : "Reserve now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SingleCabin;
