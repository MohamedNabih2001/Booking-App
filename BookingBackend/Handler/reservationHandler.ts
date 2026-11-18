import { NextFunction, Response, Request } from "express";
import { AppError } from "../Utility/AppError";
import { ERROR_CODES, ERROR_MESSAGES } from "../Utility/ErrorsType";
import { Reservation } from "../Model/reservationModel";
import { Cabin } from "../Model/cabinModel";
import { getEnv } from "../Utility/GetEnv";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const stripeKey = getEnv("STRIPE_SECRET_KEY");
const stripe = new Stripe(stripeKey);
////////////////////////////////////////////////////////
export const getAllReservationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.query;
  const filter = id
    ? {
        id: {
          $regex: String(id),
          $options: "i",
        },
      }
    : {};

  const reservations = await Reservation.find(filter)
    .limit(20)
    .populate("cabinId", "name")
    .sort("-updatedAt");
  res.json({ message: "get all reservation success", data: reservations });
};

///////////////////////////////////////
export const getUserReservationsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user.id;
  const reservations = await Reservation.find({ userId })
    .populate("cabinId", "name")
    .sort("-updatedAt");
  res.json({ message: "get all user reservation success", data: reservations });
};

///////////////////////////////////////

export const getReservationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const reservationId = req.params.id;
  if (!reservationId) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  const reservation = await Reservation.findById(reservationId).populate(
    "cabinId",
    "name",
  );
  res.json({ message: "get reservation success", data: reservation });
};
///////////////////////////////////////

export const createReservationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user.id;
  const cabinId: string = req.params.cabinId as string;
  if (!userId) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  if (!req.body || !cabinId) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  const { startDate, endDate } = req.body;
  const cabin = await Cabin.findById(cabinId);
  if (!cabin) {
    return next(new AppError(ERROR_MESSAGES.CONFLICT, ERROR_CODES.CONFLICT));
  }
  const paidStatus = "pending";

  const startDateUsed = new Date(startDate);
  const endDateUsed = new Date(endDate);
  if (endDateUsed.getTime() < startDateUsed.getTime()) {
    return next(
      new AppError(
        ERROR_MESSAGES.VALIDATION_ERROR,
        ERROR_CODES.VALIDATION_ERROR,
      ),
    );
  }
  const daysNumber =
    (endDateUsed.getTime() - startDateUsed.getTime()) / (1000 * 60 * 60 * 24) +
    1;
  const totalPrice = Number(daysNumber) * Number(cabin.pricePerDay);
  const dateReservation = { startDate: startDateUsed, endDate: endDateUsed };
  if (cabin.reservationsDates.length > 0) {
    const isReservationDateAllowed = cabin.reservationsDates.every(
      (resrevation) => {
        const caseOneCheck =
          resrevation.endDate.getTime() < startDateUsed.getTime();
        const caseTwoCheck =
          endDateUsed.getTime() < resrevation.startDate.getTime();

        return caseOneCheck || caseTwoCheck;
      },
    );
    if (!isReservationDateAllowed) {
      return next(
        new AppError(
          ERROR_MESSAGES.VALIDATION_ERROR,
          ERROR_CODES.VALIDATION_ERROR,
        ),
      );
    }
  }
  const uuid = uuidv4();
  const frontendUrl =
    process.env.NODE_ENV === "production"
      ? getEnv("FRONTEND_URL")
      : "http://localhost:5173";

  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: `Reservation-${cabin.name}-${uuid}`,
        },
        unit_amount: totalPrice * 100,
      },
      quantity: 1,
    },
  ];
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",

    success_url: `${frontendUrl}/payment/confirm?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/payment/cancel`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  });

  const newReservation = await Reservation.create({
    ...dateReservation,
    userId,
    cabinId,
    sessionId: session.id,
    sessionUrl: session.url?.toString(),
    totalPrice,
    id: String(uuid),
    daysNumber,
    paidStatus,
  });
  const newCabin = await Cabin.findByIdAndUpdate(
    cabinId,
    {
      $push: {
        reservationsDates: {
          ...dateReservation,
        },
      },
    },
    { returnDocument: "after" },
  );

  res.json({
    message: "create reservation success",
    data: newReservation,
    paymentUrl: session.url,
  });
};
///////////////////////////////////////

export const confirmReservationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sessionId = req.params.id;
  if (!sessionId) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  const reservation = await Reservation.findOne({ sessionId });
  if (!reservation) {
    return next(new AppError(ERROR_MESSAGES.CONFLICT, ERROR_CODES.CONFLICT));
  }
  if (reservation.paidStatus !== "pending") {
    return res.json({
      message: "reservation is already confirmed or canceled",
    });
  }
  const newReservation = await Reservation.findByIdAndUpdate(
    reservation._id,
    {
      $set: {
        paidStatus: "confirmed",
      },
      $unset: {
        sessionId: "",
        sessionUrl: "",
      },
    },
    { returnDocument: "after" },
  );
  res.json({ message: "reservation confirmed success", data: newReservation });
};

///////////////////////////////////////

export const cancelReservationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const reservationId = req.params.id;
  const id = req.user.id;
  if (!reservationId) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    return next(new AppError(ERROR_MESSAGES.CONFLICT, ERROR_CODES.CONFLICT));
  }
  if (id.toString() !== reservation.userId.toString()) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  if (reservation.paidStatus !== "pending") {
    res.json({ message: "reservation is already confirmed or canceled" });
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        $set: {
          paidStatus: "canceled",
        },
        $unset: {
          sessionId: "",
          sessionUrl: "",
        },
      },
      { returnDocument: "after", session },
    );
    /////////////////////////////
    await Cabin.findByIdAndUpdate(
      reservation.cabinId,
      {
        $pull: {
          reservationsDates: {
            startDate: reservation.startDate,
            endDate: reservation.endDate,
          },
        },
      },
      { session },
    );
    await session.commitTransaction();

    res.json({ message: "reservation canceled success", data: newReservation });
  } catch (e) {
    (await session).abortTransaction();
  } finally {
    (await session).endSession();
  }
};

///////////////////////////////////////
///////////////////////////////////////

export const cancelReservationAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const reservationId = req.params.id;
  const role = req.user.role;
  if (!reservationId) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    return next(new AppError(ERROR_MESSAGES.CONFLICT, ERROR_CODES.CONFLICT));
  }
  if (reservation.paidStatus !== "pending") {
    res.json({ message: "reservation is already confirmed or canceled" });
  }
  if (role !== "admin") {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        $set: {
          paidStatus: "canceled",
        },
        $unset: {
          sessionId: "",
          sessionUrl: "",
        },
      },
      { returnDocument: "after", session },
    );
    /////////////////////////////
    await Cabin.findByIdAndUpdate(
      reservation.cabinId,
      {
        $pull: {
          reservationsDates: {
            startDate: reservation.startDate,
            endDate: reservation.endDate,
          },
        },
      },
      { session },
    );
    await session.commitTransaction();

    res.json({ message: "reservation canceled success", data: newReservation });
  } catch (e) {
    (await session).abortTransaction();
  } finally {
    (await session).endSession();
  }
};

///////////////////////////////////////
///////////////////////////////////////

export const deleteReservationAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const reservationId = req.params.id;
  const role = req.user.role;
  if (role !== "admin") {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }

  if (!reservationId) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    return next(new AppError(ERROR_MESSAGES.CONFLICT, ERROR_CODES.CONFLICT));
  }
  if (reservation.paidStatus === "pending") {
    return next(new AppError(ERROR_MESSAGES.FORBIDDEN, ERROR_CODES.FORBIDDEN));
  }

  await Reservation.findByIdAndDelete(reservationId);

  res.json({ message: "Reservation is deleted successfully" });
};

///////////////////////////////////////
