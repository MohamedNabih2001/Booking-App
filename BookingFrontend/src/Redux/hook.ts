import type { AppBookingDispathType, AppBookingSelectorType } from "./store";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

export const useAppDispatchBooking =
  useDispatch.withTypes<AppBookingDispathType>();

export const useAppSelectorBooking: TypedUseSelectorHook<AppBookingSelectorType> =
  useSelector;
