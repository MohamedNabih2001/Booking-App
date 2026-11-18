import mongoose, { Query } from "mongoose";

///////////////////////////

export interface ImageType {
  imageUrl: string;
  publicId: string;
}

///////////////////////////

interface ReservationDateType {
  startDate: Date;
  endDate: Date;
}

///////////////////////////

interface SchemaType {
  name: string;
  description: string;
  maxPersonsNumber: number;
  pricePerDay: number;
  mainImage: ImageType;
  images: ImageType[] | [];
  isAllowed: boolean;
  reservationsDates: ReservationDateType[];
}

///////////////////////////////////

const cabinSchema = new mongoose.Schema<SchemaType>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minLength: [2, "Please Write Valid Name"],
    },
    description: {
      type: String,
      default: "Good Cabin to relax and Enjoy",
      minLength: [2, "Please Write Valid Name"],
    },
    maxPersonsNumber: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    isAllowed: {
      type: Boolean,
      required: true,
      default: true,
    },
    mainImage: {
      type: {
        imageUrl: { type: String },
        publicId: { type: String },
      },
    },
    images: {
      type: [
        {
          imageUrl: { type: String },
          publicId: { type: String },
        },
      ],
      default: [],
    },

    reservationsDates: {
      type: [
        {
          startDate: { type: Date, required: true },
          endDate: { type: Date, required: true },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Cabin = mongoose.model<SchemaType>("Cabin", cabinSchema);
