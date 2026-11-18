import { Link } from "react-router-dom";
import type { CabinType } from "../../types/cabinTypes";
import { cn } from "../../lib/utils";

function CabinItem({ data }: { data: CabinType }) {
  const cabinType =
    data.maxPersonsNumber > 3
      ? "large"
      : data.maxPersonsNumber === 1
        ? "small"
        : "medium";
  return (
    <div
      className={cn(
        "border h-100 shadow w-full rounded-2xl overflow-hidden col-span-1 flex flex-col items-center justify-start gap-2",
        !data.isAllowed && "grayscale",
      )}
    >
      <div className="w-full h-60 relative ">
        <img
          className="w-full h-full object-cover object-center"
          src={data.mainImage.imageUrl}
          alt={data.name}
        />
        <span className="absolute bg-orange-500 font-special font-semibold capitalize text-sm text-white dark:text-black p-2 w-22 flexCenter top-[10%] left-[-3%]  ">
          {cabinType}
        </span>
      </div>
      <div className="w-full h-40 p-2 flex flex-col items-center justify-start gap-2">
        <h3 className="font-semibold text-lg uppercase font-special text-orange-600">
          {data.name}
        </h3>
        <div className="w-full flexStart gap-2">
          <span className="font-semibold text-sm uppercase  text-orange-600">
            Price / Day :
          </span>
          <span className="font-semibold text-sm uppercase font-special">
            {data.pricePerDay} $
          </span>
        </div>
        <div className="w-full flexStart gap-2">
          <span className="font-semibold text-sm uppercase  text-orange-600">
            Max Persons Number:
          </span>{" "}
          <span className="font-semibold text-sm uppercase font-special">
            {data.maxPersonsNumber}
          </span>
        </div>
        {data.isAllowed && (
          <Link
            to={`/cabins/${data._id}`}
            className="p-2 bg-orange-700 animation text-sm uppercase font-semibold text-white dark:text-black rounded-2xl hover:bg-orange-500"
          >
            More information
          </Link>
        )}
      </div>
    </div>
  );
}

export default CabinItem;
