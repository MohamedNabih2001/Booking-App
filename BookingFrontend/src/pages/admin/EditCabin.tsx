import { useParams } from "react-router-dom";
import useGetCabin from "../../queries/cabins/useGetCabin";
import { useRef, useState } from "react";
import { Image, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import useUpdateCabin from "../../queries/cabins/useUpdateCabin";
type DeletedImage = { imageUrl: string; publicId: string; _id: string };
type ChangedDataValue = { id: string; value: string | number };
function EditCabin() {
  const [deletedImages, setDeletedImages] = useState<DeletedImage[] | []>([]);
  const [newImages, setNewImages] = useState<File[] | []>([]);
  const [mainImage, setMainImage] = useState<FileList | []>([]);
  const dataChanged = useRef<ChangedDataValue[]>([]);
  const {
    mutate: updateCabin,
    isPending: isUpdatingCabin,
    error: errorUpdatingCabin,
  } = useUpdateCabin();

  const params = useParams();
  const id = params.cabinId;
  const {
    data: cabinData,
    isLoading: isLoadingCabin,
    error: errorCabin,
  } = useGetCabin({ id });

  const { name, description, maxPersonsNumber, pricePerDay } =
    cabinData?.data ?? {};
  const dataToEdit = [
    {
      id: "name",
      label: "name",
      value: name,
    },
    {
      id: "description",
      label: "description",
      value: description,
    },
    {
      id: "maxPersonsNumber",
      label: "max persons number",
      value: maxPersonsNumber,
    },
    {
      id: "pricePerDay",
      label: "price per day",
      value: pricePerDay,
    },
  ];
  const isMainImageExist = mainImage.length > 0;
  const isNewImagesExist = newImages.length > 0;
  const mainImageSrc = isMainImageExist
    ? URL.createObjectURL(mainImage[0])
    : cabinData?.data.mainImage.imageUrl;

  function submitFunction(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    if (dataChanged.current.length > 0) {
      dataChanged.current.forEach((d) => {
        formData.append(d.id, String(d.value));
      });
    }
    if (deletedImages.length > 0) {
      const stringDeletedImages = JSON.stringify(deletedImages);
      formData.append("deletedImages", stringDeletedImages);
    }
    if (mainImage.length > 0) {
      formData.append("mainImage", mainImage[0]);
    }
    if (newImages.length > 0) {
      newImages.forEach((img) => {
        formData.append("images", img);
      });
    }

    updateCabin({ data: formData, id });
  }
  const uploadMainImage = useRef<HTMLInputElement | null>(null);
  const uploadNewImages = useRef<HTMLInputElement | null>(null);
  return (
    <div className="w-full h-full p-2 flex flex-col items-center justify-start gap-2">
      <div className="capitalize font-special text-orange-600 font-semibold text-2xl">
        Edit {cabinData?.data.name}
      </div>
      <form className="w-full flexColCenter gap-4" onSubmit={submitFunction}>
        {dataToEdit.map((data, i) => {
          return (
            <div key={i} className="w-[80%]  p-1 flexStart gap-2">
              <label
                className="w-full p-1 font-semibold capitalize"
                htmlFor={`data-${data.label}`}
              >
                {data.label} :
              </label>
              <input
                id={`data-${data.label}`}
                className="w-full border bg-gray-200 rounded-2xl p-1 focus:outline-gray-500 focus:outline-2"
                defaultValue={data.value}
                type={typeof data.value === "string" ? "text" : "number"}
                onChange={(e) => {
                  const existIndex = dataChanged.current.findIndex(
                    (item) => item.id === data.id,
                  );
                  const isExist = existIndex === -1 ? false : true;
                  if (isExist) {
                    dataChanged.current.splice(existIndex, 1);
                    dataChanged.current.push({
                      id: data.id,
                      value: e.target.value,
                    });
                  } else {
                    dataChanged.current.push({
                      id: data.id,
                      value: e.target.value,
                    });
                  }
                }}
              />
            </div>
          );
        })}
        <div className="w-full p-1 flexColCenter gap-3">
          <h3 className="font-semibold text-xl uppercase">Main Image</h3>

          <div className="w-full p-1 flexCenter gap-2">
            <div
              className={cn(
                "w-30 group relative h-30 border-gray-500 border hover:border-4 hover:scale-110 animation  overflow-hidden rounded-2xl",
              )}
            >
              <img
                className={cn("w-full h-full object-cover object-center")}
                src={mainImageSrc}
                alt={cabinData?.data.mainImage._id}
              />
              {isMainImageExist && (
                <span
                  onClick={() => setMainImage([])}
                  className="absolute hidden group-hover:block text-green-800 top-[3%] right-[7%] cursor-pointer animation hover:text-green-500 hover:scale-110 "
                >
                  <RotateCcw />
                </span>
              )}
            </div>
            <div className={cn(" flexStart gap-2")}>
              <input
                ref={uploadMainImage}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files !== null) setMainImage(e.target.files);
                }}
                type="file"
              />
              <div className={cn(" flexStart gap-2")}>
                <span
                  onClick={() => uploadMainImage.current?.click()}
                  className="text-gray-700 p-1 border-2 rounded hover:scale-110 animation cursor-pointer hover:text-black"
                >
                  <Image />
                </span>
                <span className="font-semibold capitalize">
                  Upload new Main Image
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full p-1 flexColCenter gap-3">
          <h3 className="font-semibold text-xl uppercase">
            Edit Existing Images
          </h3>

          <div className="w-full p-1 flexCenter gap-2">
            {cabinData?.data.images.map((img) => {
              const imgIndex = deletedImages.findIndex(
                (image) => image.publicId === img.publicId,
              );
              const isExist = imgIndex === -1 ? false : true;
              return (
                <div
                  key={img._id}
                  className={cn(
                    "w-30 group relative h-30 border-gray-500 border hover:border-4 hover:scale-110 animation  overflow-hidden rounded-2xl",
                  )}
                >
                  <img
                    className={cn(
                      "w-full h-full object-cover object-center",
                      isExist && "grayscale",
                    )}
                    src={img.imageUrl}
                    alt={img._id}
                  />
                  {!isExist && (
                    <span
                      onClick={() => setDeletedImages((prev) => [...prev, img])}
                      className="absolute hidden group-hover:block text-red-800 top-[3%] right-[7%] cursor-pointer animation hover:text-red-500 hover:scale-110 "
                    >
                      <Trash2 />
                    </span>
                  )}
                  {isExist && (
                    <span
                      onClick={() =>
                        setDeletedImages((prev) =>
                          prev.filter(
                            (image) => image.publicId !== img.publicId,
                          ),
                        )
                      }
                      className="absolute hidden group-hover:block text-green-800 top-[3%] right-[7%] cursor-pointer animation hover:text-green-500 hover:scale-110 "
                    >
                      <RotateCcw />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full p-1 flexColCenter gap-3">
          <h3 className="font-semibold text-xl uppercase">New Images</h3>

          <div className="w-full p-1 flexColCenter gap-2">
            <div className="w-full flexCenter gap-2">
              {isNewImagesExist &&
                newImages.map((img, i) => {
                  return (
                    <div
                      className={cn(
                        "w-30 group relative h-30 border-gray-500 border hover:border-4 hover:scale-110 animation  overflow-hidden rounded-2xl",
                      )}
                    >
                      <img
                        className={cn(
                          "w-full h-full object-cover object-center",
                        )}
                        src={URL.createObjectURL(img)}
                        alt={`${i}`}
                      />
                      <span
                        onClick={() =>
                          setNewImages((prev) =>
                            prev.filter((image) => image !== img),
                          )
                        }
                        className="absolute hidden group-hover:block text-red-800 top-[3%] right-[7%] cursor-pointer animation hover:text-red-500 hover:scale-110 "
                      >
                        <Trash2 />
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className={cn(" flexStart gap-2")}>
              <input
                ref={uploadNewImages}
                className="hidden"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);

                    setNewImages((prev) => [...prev, ...files]);
                  }
                }}
                type="file"
              />
              <div className={cn(" flexStart gap-2")}>
                <span
                  onClick={() => uploadNewImages.current?.click()}
                  className="text-gray-700 p-1 border-2 rounded hover:scale-110 animation cursor-pointer hover:text-black"
                >
                  <Image />
                </span>
                <span className="font-semibold capitalize">
                  Upload new Images
                </span>
              </div>
            </div>
          </div>
        </div>
        <button
          disabled={isUpdatingCabin}
          className="bg-orange-700 disableBtn hover:bg-orange-500 animation cursor-pointer text-white px-2 p-1 capitalize font-semibold tracking-wide hover:scale-110 rounded-2xl"
          type="submit"
        >
          {isUpdatingCabin ? "Updating . . . ." : "submit"}
        </button>
      </form>
    </div>
  );
}

export default EditCabin;
