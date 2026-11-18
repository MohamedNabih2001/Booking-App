import { Lock, User } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const navbarItems = [
  {
    name: "Personal Data",
    id: "personalData",
    path: "/profile",
    icon: <User />,
  },
  {
    name: "Change Password",
    id: "changePassword",
    path: "/profile/password",
    icon: <Lock />,
  },
];
function Profile() {
  const location = useLocation();
  return (
    <div className="w-full h-screen overflow-hidden p-2 pt-25 ">
      <div className="w-full h-full flex flex-col items-center lg:flex-row lg:items-start justify-start gap-2">
        <div className="lg:w-60 w-full lg:h-full  p-1 overflow-hidden shrink-0 lg:border-r-2">
          <div className="w-full h-full flex flex-row lg:flex-col items-center justify-center lg:justify-start gap-3">
            {navbarItems.map((item, i) => {
              const isActive = item.path == location.pathname;

              return (
                <Link
                  key={`${item.id}-${i}`}
                  className={cn(
                    "lg:w-full p-2 rounded-2xl bg-gray-50 animation md:text-md text-sm hover:bg-gray-200 capitalize flexCenter gap-2",
                    isActive && "bg-gray-200 ",
                  )}
                  to={item.path}
                >
                  <span className="md:block hidden"> {item.icon}</span>
                  <span className="text-center"> {item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="w-full h-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Profile;
