import { Navigate, useLocation } from "react-router-dom";
import { useAppSelectorBooking } from "../../Redux/hook";
import type { ReactNode } from "react";
interface PropsType {
  children: ReactNode;
}
function ProtectPage({ children }: PropsType) {
  const user = useAppSelectorBooking((state) => state.user);
  const location = useLocation();

  console.log("ProtectPage:", {
    pathname: location.pathname,
    token: user.token,
    isLoading: user.isLoading,
    role: user.role,
  });

  if (!user.token && location.pathname === "/register") {
    return children;
  }

  if (!user.token && location.pathname.includes("forget")) {
    return children;
  }
  if (!user.token && user.isLoading === false) {
    if (location.pathname === "/") {
      return children;
    }

    return <Navigate to="/" replace />;
  }
  if (user.token && location.pathname === "/register") {
    return <Navigate to="/" />;
  }
  if (
    user.token &&
    user.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectPage;
