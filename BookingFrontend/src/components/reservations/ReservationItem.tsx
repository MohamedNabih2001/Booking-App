import { Link } from "react-router-dom";
import { getDate, getHours, getMinutes, getMonth, getYear } from "date-fns";

import { cn } from "../../lib/utils";
import useCancelReservations from "../../queries/reservations/useCancelReservations";
import type { ReservationType } from "../../types/reservationType";
function ReservationItem({ data }: { data: ReservationType }) {
  const {
    mutate: cancelReservation,
    isPending: isCanceling,
    error: errorCancel,
  } = useCancelReservations();

  function formatDate(date: string) {
    const dateOfReservation = `${getYear(date)}-${getMonth(date) + 1}-${getDate(date)} at: ${getHours(date)}:${getMinutes(date)}`;
    return dateOfReservation;
  }

  function formatExpireDate(date: string) {
    const dateOfReservation = `${getYear(date)}-${getMonth(date) + 1}-${getDate(date)} at: ${getHours(date) + 1}:${getMinutes(date) - 3}`;
    return dateOfReservation;
  }
  return (
    <div className="w-full capitalize text-gray-700 font-semibold flex md:flex-row flex-col md:items-center gap-3 items-start md:justify-between justify-start  p-2 border rounded-2xl">
      <div className="w-full flex flex-col items-start justify-center  gap-2">
        <div className="text-md  w-full flex md:flex-row flex-col md:items-center items-start justify-start gap-2">
          <div className=" w-fit px-2 flexStart gap-2">
            <span>{data.id} </span>
          </div>
          <div className=" w-fit px-2 flexStart gap-2">
            <span>in {data.cabinId.name}</span>
          </div>
        </div>
        <div className="text-sm  w-full flex md:flex-row flex-col md:items-center items-start justify-start gap-2">
          <div className="w-fit px-2 flexStart gap-2">
            <span>total days :</span>
            <span>{data.daysNumber} days</span>
          </div>
          <div className=" w-fit px-2 flexStart gap-2">
            <span className="hidden lg:block">reservation date :</span>
            <span className=" lg:hidden uppercase">r.d:</span>
            <span>{formatDate(data.createdAt)}</span>
          </div>
          <div className=" w-fit px-2 flexStart gap-2">
            <span className="hidden lg:block">Expiration date :</span>
            <span className=" lg:hidden uppercase">e.d:</span>{" "}
            <span>{formatExpireDate(data.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="md:w-fit w-full  px-2 flex flex-col md:items-end items-center justify-center  gap-2">
        {data.paidStatus === "pending" && (
          <div className="w-full flex flex-row items-center md:justify-end justify-center gap-3">
            <Link
              to={data.sessionUrl}
              className={cn(
                "p-1 text-white  dark:text-black bg-green-500 cursor-pointer hover:bg-green-600 rounded-2xl",
                isCanceling && "bg-gray-600 pointer-events-none",
              )}
            >
              Confirm
            </Link>
            <button
              disabled={isCanceling}
              onClick={() => cancelReservation({ id: data._id })}
              className="p-1 disableBtn text-white dark:text-black bg-red-500 cursor-pointer hover:bg-red-600 rounded-2xl"
            >
              {isCanceling ? "Canceling " : " Cancel"}
            </button>
          </div>
        )}
        <div className="w-full flex flex-row items-center md:justify-end justify-center gap-3">
          <span
            className={cn(
              "p-1 text-white dark:text-black rounded-2xl",
              data.paidStatus === "pending" && "bg-yellow-600",
              data.paidStatus === "confirmed" && "bg-green-700",
              data.paidStatus === "canceled" && "bg-red-700",
            )}
          >
            {data.paidStatus}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ReservationItem;
