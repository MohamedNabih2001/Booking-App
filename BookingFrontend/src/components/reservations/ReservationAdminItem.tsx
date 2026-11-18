import { getDate, getHours, getMinutes, getMonth, getYear } from "date-fns";
import { cn } from "../../lib/utils";
import type { ReservationType } from "../../types/reservationType";
import useCancelAdminReservations from "../../queries/reservations/useCancelAdminReservations";
import useDeleteReservations from "../../queries/reservations/useDeleteReservations";

function ReservationAdminItem({ data }: { data: ReservationType }) {
  const {
    mutate: cancelAdminReservation,
    isPending: isCancelingAdmin,
    error: errorCancelAdmin,
  } = useCancelAdminReservations();

  const {
    mutate: deleteReservation,
    isPending: isDeletingReservation,
    error: errorDeleteReservation,
  } = useDeleteReservations();

  function formatDate(date: string) {
    const dateOfReservation = `${getYear(date)}-${getMonth(date) + 1}-${getDate(date)} at: ${getHours(date)}:${getMinutes(date)}`;
    return dateOfReservation;
  }

  function formatExpireDate(date: string) {
    const dateOfReservation = `${getYear(date)}-${getMonth(date) + 1}-${getDate(date)} at: ${getHours(date) + 1}:${getMinutes(date) - 3}`;
    return dateOfReservation;
  }
  return (
    <div className="w-full capitalize text-gray-700 font-semibold flexBetween p-2 border rounded-2xl">
      <div className="w-full flex flex-col items-start justify-center  gap-2">
        <div className="text-md  w-full flexStart gap-2">
          <div className=" w-fit px-2 flexStart gap-2">
            <span>{data.id} </span>
          </div>
          <div className=" w-fit px-2 flexStart gap-2">
            <span>in {data.cabinId.name}</span>
          </div>
        </div>
        <div className="text-sm  w-full flexStart gap-2">
          <div className="w-fit px-2 flexStart gap-2">
            <span>total days :</span>
            <span>{data.daysNumber} days</span>
          </div>
          <div className=" w-fit px-2 flexStart gap-2">
            <span>reservation date :</span>
            <span>{formatDate(data.createdAt)}</span>
          </div>
          <div className=" w-fit px-2 flexStart gap-2">
            <span>expire Date :</span>
            <span>{formatExpireDate(data.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="w-fit px-2 flex flex-col items-end justify-center  gap-2">
        <div className="w-full flexEnd gap-3">
          {data.paidStatus !== "pending" && (
            <button
              onClick={() => deleteReservation({ id: data._id })}
              disabled={isDeletingReservation}
              className={cn(
                "p-1 text-white disableBtn  dark:text-black bg-red-500 cursor-pointer hover:bg-red-600 rounded-2xl",
                isCancelingAdmin && "bg-gray-600 pointer-events-none",
              )}
            >
              Delete
            </button>
          )}
          {data.paidStatus === "pending" && (
            <button
              disabled={isCancelingAdmin}
              onClick={() => cancelAdminReservation({ id: data._id })}
              className="p-1 disableBtn text-white dark:text-black bg-blue-500 cursor-pointer hover:bg-blue-600 rounded-2xl"
            >
              {isCancelingAdmin ? "Canceling " : " Cancel"}
            </button>
          )}
        </div>
        <div className="w-full flexEnd gap-3">
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

export default ReservationAdminItem;
