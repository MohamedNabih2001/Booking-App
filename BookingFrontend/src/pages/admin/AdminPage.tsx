import { ListCheck, TentTree, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { Link, Outlet, useLocation } from "react-router-dom";

const sidebarAdminItems = [
  { id: "users", path: "/admin", name: "Users", icon: <User /> },
  { id: "cabins", path: "/admin/cabins", name: "Cabins", icon: <TentTree /> },
  {
    id: "reservations",
    path: "/admin/reservations",
    name: "Reservations",
    icon: <ListCheck />,
  },
];
function AdminPage() {
  const location = useLocation();
  return (
    <div className="w-full h-screen pt-25 overflow-hidden p-2">
      <div className="w-full h-full  flexStart gap-3">
        <div className="w-60 h-full  shrink-0 overflow-hidden border-r-2 border-gray-300">
          <div
            className={cn(
              "w-full flex flex-col gap-3 items-center justify-center p-2 ",
            )}
          >
            {sidebarAdminItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isIncludes =
                location.pathname.startsWith(item.path) &&
                item.path !== "/admin";
              console.log(isIncludes);

              return (
                <Link
                  to={item.path}
                  className={cn(
                    "flexStart gap-3 capitalize text-sm w-full  md:text-base  text-gray-600 rounded-2xl cursor-pointer hover:text-black  hover:bg-gray-100 bg-white p-1.5",
                    isActive && " bg-gray-100 text-black",
                    isIncludes && " bg-gray-100 text-black",
                  )}
                  key={item.id}
                >
                  <span>{item.icon}</span> <p>{item.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="w-full h-full overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
