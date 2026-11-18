import { ImageUp, User } from "lucide-react";
import { useForm } from "react-hook-form";
import Input from "../../components/form/Input";
import useCreateCabin from "../../queries/cabins/useCreateCabin";

const cabinSchemaData = [
  {
    type: "text",
    id: "name",
    placeholder: "Name",
    icon: <User size={20} />,
  },
  {
    type: "text",
    id: "description",
    placeholder: "Description",
    icon: <User size={20} />,
  },
  {
    type: "text",
    id: "maxPersonsNumber",
    placeholder: "Max persons on cabin",
    icon: <User size={20} />,
  },
  {
    type: "text",
    id: "pricePerDay",
    placeholder: "Price per Day",
    icon: <User size={20} />,
  },

  {
    type: "file",
    id: "mainImage",
    placeholder: "Cabin Main Image",
    icon: <ImageUp size={20} />,
  },
  {
    type: "file",
    id: "images",
    placeholder: "Cabin Images",
    icon: <ImageUp size={20} />,
  },
] as const;
export type FormDataCabinType = {
  name: string;
  description: string;
  maxPersonsNumber: number;
  pricePerDay: number;
  mainImage: FileList;
  images: FileList;
};
function AddNewCabin() {
  const { handleSubmit, register, resetField, watch } =
    useForm<FormDataCabinType>();
  const filesNumber = {
    images: watch("images")?.length,
    mainImage: watch("mainImage")?.length,
  };

  type CabinKeys = (typeof cabinSchemaData)[number]["id"];

  function resetFieldValue(nameField: CabinKeys) {
    if (nameField) {
      return () => resetField(nameField);
    } else {
      return undefined;
    }
  }
  const {
    mutate: createCabin,
    isPending: isCreatingCabin,
    error: errorCreatingCabin,
  } = useCreateCabin();

  function onSubmit(data: FormDataCabinType) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, String(value));
      }
    });
    createCabin(formData);
  }

  return (
    <div className="w-full p-2 h-full flexCenter text-black  ">
      <div className=" w-60 md:w-100 flex flex-col gap-2 border border-gray-300 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md ">
        <p className="bg-orange-500 p-3 text-gray-50 text-2xl uppercase text-center w-full">
          New Cabin
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-2 w-full flex flex-col justify-center items-center gap-5 pt-9"
        >
          {cabinSchemaData.map((field) => {
            if (field.type === "file") {
              if (field.id === "mainImage") {
                return (
                  <Input
                    key={field.id}
                    id={field.id}
                    isMulti={false}
                    type={field.type}
                    placeholder={field.placeholder}
                    icon={field.icon}
                    resetFile={resetFieldValue(field.id)}
                    filesNumber={filesNumber[field.id]}
                    {...register(field.id)}
                  />
                );
              } else {
                return (
                  <Input
                    key={field.id}
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    icon={field.icon}
                    resetFile={resetFieldValue(field.id)}
                    filesNumber={filesNumber[field.id]}
                    {...register(field.id)}
                  />
                );
              }
            } else {
              return (
                <Input
                  key={field.id}
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  icon={field.icon}
                  {...register(field.id)}
                />
              );
            }
          })}

          <button
            disabled={isCreatingCabin}
            className="p-2 font-semibold disableBtn bg-red-700 text-gray-50 rounded-sm cursor-pointer hover:scale-110 animation text-[15px]"
          >
            {isCreatingCabin ? "Creating Cabin . . . . . " : "Create New Cabin"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewCabin;
