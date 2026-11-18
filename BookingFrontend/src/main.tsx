import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/main/App.tsx";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";
import { setupInterceptorsApp } from "./api/axios.ts";
import { apiBooking } from "./api/axios.ts";
import { logout, refreshToken } from "./Redux/userSlice.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Root } from "./route.tsx";

setupInterceptorsApp(apiBooking, refreshToken, store, logout);
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Provider store={store}>
        <Root />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
