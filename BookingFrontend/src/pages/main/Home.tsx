import SignInPage from "../auth/SignInPage";
import Spinner from "../../components/global/Spinner";
import HomeComponents from "../../components/home/HomeComponents ";
import { useAppSelectorBooking } from "../../Redux/hook";
function Home() {
  const user = useAppSelectorBooking((state) => state.user);
  if (user.isLoading === null || user.isLoading === true) {
    return (
      <div className="flexCenter w-full p-3 h-screen">
        <Spinner />
      </div>
    );
  } else if (!user.token) {
    return (
      <div className="w-full">
        <SignInPage />
      </div>
    );
  } else {
    return (
      <div className="w-full  ">
        <HomeComponents />
      </div>
    );
  }
}

export default Home;
