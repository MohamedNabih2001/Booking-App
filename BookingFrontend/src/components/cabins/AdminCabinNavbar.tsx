import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import type { ReactNode } from "react";
type ItemNavbarType = {
  icon: ReactNode;
  name: string;
  path: string;
};

function AdminCabinNavbar({ item }: { item: ItemNavbarType }) {
  const location = useLocation();
  const isActive = item.path == location.pathname;

  return (
    <Link
      className={cn(
        "p-1  bg-gray-500 flexStart gap-1 text-white rounded-2xl text-sm hover:scale-110 animation shadow",
        isActive && "-translate-y-1 scale-110 bg-blue-400",
      )}
      to={item.path}
    >
      <span>{item.icon}</span>
      <span>{item.name}</span>
    </Link>
  );
}

export default AdminCabinNavbar;
