import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./pages/main/App";
import AuthPage from "./pages/protect/AuthPage";
import ErrorPage from "./pages/protect/ErrorPage";
import Register from "./pages/auth/Register";
import ProtectPage from "./pages/protect/ProtectPage";
import Home from "./pages/main/Home";
import { ToastContainer } from "react-toastify";
import Cabins from "./pages/main/Cabins";
import AdminPage from "./pages/admin/AdminPage";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCabins from "./pages/admin/AdminCabins";
import AdminReservations from "./pages/admin/AdminReservations";
import SingleCabin from "./pages/main/SingleCabin";
import Reservations from "./pages/main/Reservations";
import Confirm from "./pages/payment/Confirm";
import AddNewCabin from "./pages/admin/AddNewCabin";
import ShowCabins from "./pages/admin/ShowCabins";
import EditCabin from "./pages/admin/EditCabin";
import Profile from "./pages/main/Profile";
import PersonalData from "./pages/profile/PersonalData";
import ChangePassword from "./pages/profile/ChangePassword";
import ForgetPasswordTokenValidation from "./pages/auth/ForgetPasswordTokenValidation";
import ForgetPassword from "./pages/auth/ForgetPassword";
const appRoute = createBrowserRouter([
  {
    path: "",
    errorElement: (
      <ProtectPage>
        {" "}
        <ErrorPage />
      </ProtectPage>
    ),
    element: (
      <ProtectPage>
        <App />
      </ProtectPage>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectPage>
            <Home />
          </ProtectPage>
        ),
      },

      {
        path: "/cabins",
        element: (
          <ProtectPage>
            {" "}
            <Cabins />
          </ProtectPage>
        ),
      },
      {
        path: "/reservations",
        element: (
          <ProtectPage>
            {" "}
            <Reservations />
          </ProtectPage>
        ),
      },
      {
        path: "/payment/confirm",
        element: <Confirm />,
      },
      {
        path: "/forget",
        element: <ForgetPassword />,
      },
      {
        path: "/forget/setNewPassword",
        element: <ForgetPasswordTokenValidation />,
      },

      {
        path: "/cabins/:cabinId",
        element: <SingleCabin />,
      },
      {
        path: "/profile",
        element: (
          <ProtectPage>
            {" "}
            <Profile />{" "}
          </ProtectPage>
        ),
        children: [
          {
            index: true,
            element: <PersonalData />,
          },
          {
            path: "/profile/password",
            element: <ChangePassword />,
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <ProtectPage>
            <AdminPage />
          </ProtectPage>
        ),
        children: [
          {
            index: true,
            element: (
              <ProtectPage>
                <AdminUsers />
              </ProtectPage>
            ),
          },
          {
            path: "/admin/cabins",
            element: (
              <ProtectPage>
                <AdminCabins />
              </ProtectPage>
            ),
            children: [
              {
                index: true,
                element: (
                  <ProtectPage>
                    <ShowCabins />
                  </ProtectPage>
                ),
              },
              {
                path: "addCabin",
                element: (
                  <ProtectPage>
                    <AddNewCabin />{" "}
                  </ProtectPage>
                ),
              },
              {
                path: "editCabin/:cabinId",
                element: (
                  <ProtectPage>
                    {" "}
                    <EditCabin />
                  </ProtectPage>
                ),
              },
            ],
          },
          {
            path: "/admin/reservations",
            element: (
              <ProtectPage>
                <AdminReservations />
              </ProtectPage>
            ),
          },
        ],
      },
      {
        path: "/register",
        element: (
          <ProtectPage>
            <Register />
          </ProtectPage>
        ),
      },
    ],
  },
]);

export function Root() {
  return (
    <>
      <AuthPage>
        <ToastContainer
          theme="colored"
          position="top-center"
          newestOnTop={true}
          autoClose={1500}
        />

        <RouterProvider router={appRoute} />
      </AuthPage>
    </>
  );
}
