import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAppDispatchBooking } from "../../Redux/hook";
import { logout, refreshToken } from "../../Redux/userSlice";
import Spinner from "../../components/global/Spinner";

interface PropsType {
  children: ReactNode;
}
function AuthPage({ children }: PropsType) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useAppDispatchBooking();
  const didRun = useRef<boolean>(false);
  useEffect(() => {
    async function refresh() {
      didRun.current = true;
      try {
        await dispatch(refreshToken()).unwrap();
      } catch (err) {
        console.log("error from auth page", err);
        dispatch(logout());
      } finally {
        setIsCheckingAuth(false);
      }
    }
    if (didRun.current) {
      return;
    } else {
      refresh();
    }
  }, [dispatch]);

  if (isCheckingAuth) {
    return <Spinner />;
  }
  return children;
}

export default AuthPage;
