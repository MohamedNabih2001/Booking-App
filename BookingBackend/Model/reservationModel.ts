import mongoose from "mongoose";

///////////////////////////
type PaidStatusType = "pending" | "confirmed" | "canceled";
interface SchemaType {
  id: string;
  daysNumber: number;
  cabinId: mongoose.Schema.Types.ObjectId | string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  expireTime: string;
  sessionUrl: string;
  sessionId: string;
  userId: mongoose.Schema.Types.ObjectId | string;
  paidStatus: PaidStatusType;
}

///////////////////////////////////

const reservationSchema = new mongoose.Schema<SchemaType>(
  {
    daysNumber: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cabinId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Cabin",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    expireTime: { type: String, default: "after 1 hour from reservation time" },
    paidStatus: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "confirmed", "canceled"],
    },
    sessionId: {
      type: String,
    },
    sessionUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Reservation = mongoose.model<SchemaType>(
  "Reservation",
  reservationSchema,
);
