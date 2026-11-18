import { House, Plus } from "lucide-react";
import { Outlet } from "react-router-dom";
import AdminCabinNavbar from "../../components/cabins/AdminCabinNavbar";

const cabinNavbar = [
  { path: "/admin/cabins", name: "Show Cabins", icon: <House size={20} /> },
  {
    path: "/admin/cabins/addCabin",
    name: "Add New Cabin",
    icon: <Plus size={20} />,
  },
];
function AdminCabins() {
  return (
    <div className="w-full h-full p-2 flex flex-col justify-start items-center gap-3">
      <div className="flexCenter gap-3 p-2">
        {cabinNavbar.map((item) => {
          return <AdminCabinNavbar item={item} key={item.name} />;
        })}
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminCabins;
