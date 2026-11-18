import { useState } from "react";
import type { CabinType } from "../../types/cabinTypes";
import { cn } from "../../lib/utils";

interface PropsType {
  data: CabinType;
}
function CabinImages({ data }: PropsType) {
  const [imgOnShow, setImgOnShow] = useState<string | null>(function () {
    return data.images[0].imageUrl || null;
  });
  return (
    <div className="w-full p-2 flex items-center flex-col justify-center lg:flex-row lg:justify-between">
      <div className="w-full lg:w-[49.5%] p-2 flexColCenter self-start  gap-2">
        <h2 className="font-semibold text-md md:text-lg capitalize">
          Main image
        </h2>
        <div className="w-full rounded-xl overflow-hidden h-50 sm:h-70 md:h-90">
          <img
            className="w-full h-full object-center object-cover"
            src={data.mainImage.imageUrl}
            alt={data.name}
          />
        </div>
      </div>
      <div className=" w-full lg:w-[49.5%] p-2 flexColCenter self-start  gap-2">
        <h2 className=" font-semibold text-md md:text-lg capitalize">
          Other images about cabin
        </h2>
        <div className="w-full rounded-xl overflow-hidden h-50 sm:h-70 md:h-90">
          {imgOnShow ? (
            <img
              className="w-full h-full object-center object-contain"
              src={imgOnShow}
              alt={"other images"}
            />
          ) : (
            <img
              className="w-full h-full object-center object-cover"
              src={data.mainImage.imageUrl}
              alt={data.name}
            />
          )}
        </div>
        <div className="w-[90%] grid grid-cols-3 gap-3">
          {data.images.map((image, i) => {
            const isActiveShow = image.imageUrl === imgOnShow;
            return (
              <div
                key={image._id}
                onMouseEnter={() => setImgOnShow(image.imageUrl)}
                className={cn(
                  "col-span-1 rounded-xl overflow-hidden h-20 animation cursor-pointer hover:border-black hover:scale-110 hover:border-2",
                  isActiveShow && "border-black scale-110 border-2",
                )}
              >
                <img
                  className="w-full h-full object-cover object-center"
                  src={image.imageUrl}
                  alt={image._id}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CabinImages;
