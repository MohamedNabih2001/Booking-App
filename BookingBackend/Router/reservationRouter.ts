import express from "express";
import { authMe, restrictToAdmin } from "../Handler/authHandler";
import {
  cancelReservation,
  cancelReservationAdmin,
  confirmReservation,
  createReservation,
  deleteReservationAdmin,
  getAllReservations,
  getReservation,
  getUserReservations,
} from "../Controller/reservationController";

export const reservationRouter = express.Router();

reservationRouter.route("/").get(authMe, restrictToAdmin, getAllReservations);

reservationRouter.route("/user").get(authMe, getUserReservations);

reservationRouter.route("/cabin/:cabinId").post(authMe, createReservation);

reservationRouter.route("/:id/confirm").put(authMe, confirmReservation);

reservationRouter.route("/:id/cancel").put(authMe, cancelReservation);

reservationRouter
  .route("/:id/admin")
  .put(authMe, restrictToAdmin, cancelReservationAdmin)
  .delete(authMe, restrictToAdmin, deleteReservationAdmin);
reservationRouter.route("/:id").get(authMe, getReservation);
