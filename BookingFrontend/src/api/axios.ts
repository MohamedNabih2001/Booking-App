import axios from "axios";
import { redirect } from "react-router-dom";
export const apiBooking = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export const setupInterceptorsApp = (
  api: any,
  refreshFunction: any,
  store: any,
  logout: any,
) => {
  api.interceptors.request.use(
    (config: any) => {
      const token = store.getState().user.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    },
  );
  let refreshPromise: Promise<any> | null = null;
  api.interceptors.response.use(
    (response: any) => {
      return response;
    },
    async (error: any) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest.retry &&
        !originalRequest.url.includes("/refresh")
      ) {
        originalRequest.retry = true;
        try {
          if (!refreshPromise) {
            refreshPromise = store
              .dispatch(refreshFunction())
              .unwrap()
              .finally(() => (refreshPromise = null));
          }
          const data = await refreshPromise;
          const token = data.data.token;
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (error) {
          console.log(error);
          store.dispatch(logout());
          redirect("/");
        }
      }
      return Promise.reject(error);
    },
  );
};
