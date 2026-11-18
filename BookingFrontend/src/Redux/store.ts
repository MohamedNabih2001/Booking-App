import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: { user: userSlice },
});

export type AppBookingDispathType = typeof store.dispatch;
export type AppBookingSelectorType = ReturnType<typeof store.getState>;
