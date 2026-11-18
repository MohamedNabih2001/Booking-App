import { Key, Mail, User } from "lucide-react";
import Input from "../../components/form/Input";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { cn } from "../../lib/utils";
import useRegister from "../../queries/auth/useRegister";
const signInData = [
  {
    type: "text",
    id: "name",
    placeholder: "Name",
    icon: <User size={20} />,
  },
  {
    type: "email",
    id: "email",
    placeholder: "E-mail",
    icon: <Mail size={20} />,
  },

  {
    type: "password",
    id: "password",
    placeholder: "Password",
    icon: <Key size={20} />,
  },
  {
    type: "password",
    id: "passwordConfirm",
    placeholder: "Password Confirm",
    icon: <Key size={20} />,
  },
] as const;
export type FormDataRegisterType = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};
export type FormDataEditedRegisterType = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};
function Register() {
  const { handleSubmit, formState, register, resetField, watch } =
    useForm<FormDataRegisterType>();

  const validation = {
    length: watch("password")?.length >= 8,
    uppercase: /[A-Z]/.test(watch("password")),
    lowercase: /[a-z]/.test(watch("password")),
    number: /\d/.test(watch("password")),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(watch("password")),
  };
  const isValid = Object.values(validation).every(Boolean);
  const keys = Object.keys(validation) as (keyof typeof validation)[];
  ////////////////////////////////

  function isEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  ////////////////////////////////
  const {
    mutate: registerApp,
    isPending: isRegistering,
    error: registerError,
  } = useRegister();

  ////////////////////////////////(
  function onSubmit(data: FormDataRegisterType) {
    const isEmailValid = isEmail(data.email);
    if (!isEmailValid || !isValid) {
      console.log("Please Provide valid data email and password");
      return "Not valid";
    }
    registerApp(data);
  }

  ////////////////////////////////
  return (
    <div className="w-full p-2 min-h-screen flexCenter  ">
      <div className=" w-60 md:w-100 flex flex-col gap-2 border border-gray-300 rounded-2xl overflow-hidden bg-white/30 backdrop-blur-md ">
        <p className="bg-blue-500 p-3 text-gray-50 text-2xl uppercase text-center w-full">
          Register
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-2 w-full flex flex-col justify-center items-center gap-5 pt-9"
        >
          {signInData.map((data, i) => {
            if (data.id === "password") {
              return (
                <div key={i} className="w-full flex flex-col gap-2">
                  <Input
                    key={i}
                    isPasswordvalid={isValid}
                    id={data.id}
                    type={data.type}
                    placeholder={data.placeholder}
                    icon={data.icon}
                    {...register(data.id, {
                      required: `${data.placeholder} is required`,
                    })}
                  />
                  {watch("password") && !isValid ? (
                    <>
                      {keys.map((k) => {
                        return (
                          <div className="w-full flexStart gap-1 p-1" key={k}>
                            <span
                              className={cn(
                                "p-2 rounded-full",
                                validation[k] ? "bg-green-500" : "bg-red-500",
                              )}
                            ></span>
                            <p>Vaidation {k}</p>
                          </div>
                        );
                      })}
                    </>
                  ) : null}
                </div>
              );
            } else {
              return (
                <Input
                  key={i}
                  id={data.id}
                  type={data.type}
                  placeholder={data.placeholder}
                  icon={data.icon}
                  {...register(data.id, {
                    required: `${data.placeholder} is required`,
                  })}
                />
              );
            }
          })}
          <button
            disabled={isRegistering || !isValid}
            className="p-2 disableBtn bg-blue-700 text-gray-50 rounded-sm cursor-pointer hover:scale-102 animation text-[15px]"
          >
            {isRegistering ? "Registering . . . . . " : "Register"}
          </button>
        </form>
        <div className="p-2 w-full flexCenter gap-2 text-md text-gray-950">
          <span>If you have account </span>
          <Link className="text-green-700 hover:text-green-800" to="/">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
