import { Slider } from "../../components/ui/slider";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronUp, FunnelX } from "lucide-react";

function CabinsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<number[]>(function () {
    const valueLT = Number(searchParams.get("pricePerDay[lte]"));
    const valueGT = Number(searchParams.get("pricePerDay[gte]"));
    if (valueGT === 0 || valueLT === 0) {
      return [20, 300];
    } else {
      return [valueGT, valueLT];
    }
  });
  const [cabinPersons, setCabinPersons] = useState<number[]>(function () {
    const valueLT = Number(searchParams.get("maxPersonsNumber[lte]"));
    if (valueLT === 0) {
      return [10];
    } else {
      return [valueLT];
    }
  });
  const [activateFilters, setActivateFilters] = useState({
    priceRangeFilter: false,
    cabinPersonsFilter: false,
  });
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const minPricePerDay = 20;
  const maxPricePerDay = 300;
  const maxCabinPersons = 10;
  const minCabinPersons = 1;

  const filterString =
    searchParams.toString().length > 0 ? `?${searchParams.toString()}` : null;
  console.log(filterString);
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (
      activateFilters.priceRangeFilter === false &&
      activateFilters.cabinPersonsFilter === false
    ) {
      return;
    }

    if (activateFilters.priceRangeFilter === true) {
      params.set("pricePerDay[gte]", String(priceRange[0]));
      params.set("pricePerDay[lte]", String(priceRange[1]));
    }

    if (activateFilters.cabinPersonsFilter === true) {
      params.set("maxPersonsNumber[lte]", String(cabinPersons[0]));
    }

    setSearchParams(params);
  }, [priceRange, cabinPersons, activateFilters, searchParams]);
  return (
    <div className=" gap-4 w-65 shrink-0 md:h-full h-auto p-2 flex flex-col items-start justify-start md:border-r-2 border-gray-100 pr-2">
      <div className="w-full flexBetween">
        <span className="capitalize font-semibold text-lg">filters:</span>
        <div className="flexEnd gap-2">
          {filterString && (
            <button
              aria-label="remove_filters"
              type="button"
              className="cursor-pointer hover:text-red-600"
              onClick={() => {
                setActivateFilters({
                  priceRangeFilter: false,
                  cabinPersonsFilter: false,
                });
                setSearchParams(new URLSearchParams());
                setPriceRange([40, 300]);
                setCabinPersons([10]);
              }}
            >
              <FunnelX />
            </button>
          )}
          <span
            onClick={() => setOpenFilter((prev) => !prev)}
            className="hover:text-blue-600 cursor-pointer "
          >
            {openFilter ? <ChevronUp /> : <ChevronDown />}
          </span>
        </div>
      </div>
      <div className="h-0.5 bg-gray-400 w-full"></div>
      {openFilter && (
        <div className=" w-full flex flex-col items-start justify-center gap-6">
          <div className="w-full p-2 flex flex-col items-start justify-center gap-9">
            <span>Price / day:</span>
            <div className="w-full relative">
              <span
                style={{
                  clipPath:
                    "polygon(0 0,100% 0,100% 80%,70% 90%,50% 100%,30% 90%,0 80%)",
                  left: `${Math.ceil((priceRange[0] / maxPricePerDay) * 100)}%`,
                }}
                className={cn(
                  "absolute w-9 top-[-420%] rounded-t-md   p-1 text-sm flexCenter  bg-gray-400 text-white dark:text-black",
                  priceRange[0] >= 240
                    ? "-translate-x-7 "
                    : priceRange[0] < 180
                      ? "-translate-x-7"
                      : "-translate-x-8",
                )}
              >
                {priceRange[0]}
              </span>
              <span
                style={{
                  clipPath:
                    "polygon(0 0,100% 0,100% 80%,70% 90%,50% 100%,30% 90%,0 80%)",
                  left: `${(priceRange[1] / maxPricePerDay) * 100}%`,
                }}
                className={cn(
                  "absolute w-9 top-[-420%] rounded-t-md p-1 text-sm flexCenter  bg-gray-400 text-white dark:text-black",
                  priceRange[1] >= 240
                    ? "-translate-x-7 "
                    : priceRange[1] < 180
                      ? "-translate-x-7"
                      : "-translate-x-8",
                )}
              >
                {priceRange[1]}
              </span>
              <Slider
                onValueChange={(value) => {
                  if (Array.isArray(value)) {
                    setActivateFilters((prev) => ({
                      ...prev,
                      priceRangeFilter: true,
                    }));
                    setPriceRange([...value]);
                  }
                }}
                value={priceRange}
                min={minPricePerDay}
                max={maxPricePerDay}
                step={10}
              />
            </div>
          </div>
          <div className="h-0.5 bg-gray-400 w-full"></div>
          <div className="w-full p-2 flex flex-col items-start justify-center gap-9">
            <span>Max No. Persons :</span>

            <div className="w-full relative">
              <span
                style={{
                  clipPath:
                    "polygon(0 0,100% 0,100% 80%,70% 90%,50% 100%,30% 90%,0 80%)",
                  left: `${(cabinPersons[0] / maxCabinPersons) * 100}%`,
                }}
                className={cn(
                  "absolute w-9 -top-[420%] rounded-t-md  p-1 text-sm flexCenter -translate-x-6.5  bg-gray-400 dark:text-black text-white",
                )}
              >
                {cabinPersons[0]}
              </span>
              <Slider
                onValueChange={(value) => {
                  if (typeof value === "number") {
                    setActivateFilters((prev) => ({
                      ...prev,
                      cabinPersonsFilter: true,
                    }));

                    setCabinPersons([value]);
                  }
                }}
                value={cabinPersons}
                min={minCabinPersons}
                max={maxCabinPersons}
                step={1}
              />
            </div>
          </div>
          <div className="h-0.5 bg-gray-400 w-full"></div>
        </div>
      )}
    </div>
  );
}

export default CabinsFilter;
