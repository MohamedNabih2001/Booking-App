import { Outlet } from "react-router-dom";
import { useAppSelectorBooking } from "../../Redux/hook";
import Navbar from "../../components/global/Navbar";
import "react-day-picker/dist/style.css";
import { useEffect } from "react";

function App() {
  const user = useAppSelectorBooking((state) => state.user);
  const isAuth = user && user.isLoading === false && user.token;

  useEffect(() => {
    if (user && isAuth) {
      const isDark = document.documentElement.classList.contains("dark");
      if (!isDark && user.theme === "dark") {
        document.documentElement.classList.add("dark");
      }
      if (isDark && user.theme === "light") {
        document.documentElement.classList.remove("dark");
      }
      if (isDark && user.theme === "dark") {
        return;
      }
      if (!isDark && user.theme === "light") {
        return;
      }
    }
    if (!isAuth) {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [user, user.theme]);

  return (
    <div className="h-full w-full overflow-x-hidden  overflow-y-auto text-black bg-white relative ">
      {isAuth && <Navbar />}
      <Outlet />
    </div>
  );
}

export default App;
