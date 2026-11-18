import {
  House,
  ListChecks,
  Menu,
  MonitorCog,
  TentTree,
  User,
  UserStar,
} from "lucide-react";
import Logo from "./Logo";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Link, useLocation } from "react-router-dom";
import useCloseClickOutSide from "../../lib/useCloseOutside";
import { useAppSelectorBooking } from "../../Redux/hook";
const navbarTtems = [
  { id: "home", path: "/", name: "Home", icon: <House /> },
  { id: "cabins", path: "/cabins", name: "Cabin", icon: <TentTree /> },
  { id: "profile", path: "/profile", name: "Profile", icon: <User /> },
  {
    id: "reservation",
    path: "/reservations",
    name: "Reservation",
    icon: <ListChecks />,
  },
  {
    id: "adminControl",
    path: "/admin",
    name: "Admin CS",
    icon: <MonitorCog />,
  },
];

function Navbar() {
  const [openDropdown, setOpendDropdown] = useState<boolean>(false);
  const user = useAppSelectorBooking((state) => state.user);
  const location = useLocation();
  const navBtnRef = useRef(null);
  const navbarRef = useRef(null);
  function closeNavbar() {
    setOpendDropdown(false);
  }
  useCloseClickOutSide({
    expect: navBtnRef,
    ref: navbarRef,
    closeFunction: closeNavbar,
  });
  return (
    <div
      ref={navbarRef}
      className="w-[70%] fixed rounded-4xl  bg-gray-50 border-gray-100 border flex flex-col gap-1  justify-center items-center top-4 left-[50%] translate-x-[-50%] z-300 "
    >
      <div className="w-full h-15 relative bg-white p-2 flexBetween shadow rounded-4xl z-400  ">
        <Logo />
        <div>
          <span ref={navBtnRef}>
            <Menu
              onClick={() => setOpendDropdown((prev) => !prev)}
              className="animation hover:cursor-pointer hover:scale-115"
            />
          </span>
        </div>
      </div>
      {openDropdown && (
        <div
          className={cn(
            "w-0 flex flex-col gap-3 items-center justify-center p-2 ",
            openDropdown && "w-full",
          )}
        >
          {navbarTtems.map((item) => {
            const isActive = location.pathname === item.path;
            const isForAdminOnly = item.path.includes("admin");
            if (isForAdminOnly) {
              if (user.role === "admin")
                return (
                  <Link
                    to={item.path}
                    className={cn(
                      "flexStart gap-3 capitalize text-sm  md:text-base  text-gray-600 rounded-2xl cursor-pointer hover:text-black  hover:bg-gray-100 bg-white p-1.5 w-[70%]",
                      isActive && " bg-gray-100 text-black",
                    )}
                    key={item.id}
                  >
                    <span>{item.icon}</span> <p>{item.name}</p>
                  </Link>
                );
            } else {
              return (
                <Link
                  to={item.path}
                  className={cn(
                    "flexStart gap-3 capitalize text-sm  md:text-base  text-gray-600 rounded-2xl cursor-pointer hover:text-black  hover:bg-gray-100 bg-white p-1.5 w-[70%]",
                    isActive && " bg-gray-100 text-black",
                  )}
                  key={item.id}
                >
                  <span>{item.icon}</span> <p>{item.name}</p>
                </Link>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

export default Navbar;
