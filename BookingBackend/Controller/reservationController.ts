import {
  cancelReservationHandler,
  confirmReservationHandler,
  createReservationHandler,
  getAllReservationHandler,
  getReservationHandler,
  getUserReservationsHandler,
  deleteReservationAdminHandler,
  cancelReservationAdminHandler,
} from "../Handler/reservationHandler";
import { asyncHandler } from "../Utility/globalError";

export const getAllReservations = asyncHandler(getAllReservationHandler);
export const getReservation = asyncHandler(getReservationHandler);
export const getUserReservations = asyncHandler(getUserReservationsHandler);
export const createReservation = asyncHandler(createReservationHandler);
export const confirmReservation = asyncHandler(confirmReservationHandler);
export const cancelReservation = asyncHandler(cancelReservationHandler);
export const cancelReservationAdmin = asyncHandler(
  cancelReservationAdminHandler,
);
export const deleteReservationAdmin = asyncHandler(
  deleteReservationAdminHandler,
);
