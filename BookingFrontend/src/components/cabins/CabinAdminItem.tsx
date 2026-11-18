import { Link } from "react-router-dom";
import { getDate, getHours, getMinutes, getMonth, getYear } from "date-fns";

import { cn } from "../../lib/utils";
import type { CabinType } from "../../types/cabinTypes";
import useUpdateCabin from "../../queries/cabins/useUpdateCabin";
function CabinAdminItem({ data }: { data: CabinType }) {
  function formatDate(date: string) {
    const dateOfReservation = `${getYear(date)}-${getMonth(date) + 1}-${getDate(date)} at: ${getHours(date)}:${getMinutes(date)}`;
    return dateOfReservation;
  }

  const {
    mutate: updateCabin,
    isPending: isUpdatingCabin,
    error: errorUpdatingCabin,
  } = useUpdateCabin();
  function changeCabinAllowing() {
    const newFormData = new FormData();
    if (data.isAllowed === true) {
      newFormData.append("isAllowed", "false");
    } else {
      newFormData.append("isAllowed", "true");
    }
    updateCabin({ id: data._id, data: newFormData });
  }
  return (
    <div className="w-full capitalize text-gray-700 font-semibold flexBetween p-2 border rounded-2xl">
      <div className="w-full flex flex-col items-start justify-center  gap-2">
        <div className="text-md  w-full flexStart gap-2">
          <div className=" w-fit px-2 flexStart gap-2">
            <span>{data.name} </span>
          </div>
        </div>
        <div className="text-sm  w-full flexStart gap-2">
          <div className=" w-fit px-2 flexStart gap-2">
            <span>Created at :</span>
            <span>{formatDate(data.createdAt)}</span>
          </div>
          <div className=" w-fit px-2 flexStart gap-2">
            <span>Updated at :</span>
            <span>{formatDate(data.updatedAt)}</span>
          </div>
        </div>
      </div>
      <div className="w-fit px-2 flex flex-col items-end justify-center  gap-2">
        <div className="w-full flexEnd gap-3">
          <Link
            to={`/admin/cabins/editCabin/${data._id}`}
            className={cn(
              "p-1 px-2 text-white  dark:text-black bg-green-500 cursor-pointer hover:bg-green-600 rounded-2xl",
            )}
          >
            Edit
          </Link>
          <button
            // disabled={isDeleting}
            onClick={changeCabinAllowing}
            className="p-1 disableBtn text-white dark:text-black bg-red-500 cursor-pointer hover:bg-red-600 rounded-2xl"
          >
            {data.isAllowed ? "Disallow" : "Allow"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CabinAdminItem;
