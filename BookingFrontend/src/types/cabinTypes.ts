export type ReservationDateType = {
  startDate: string;
  endDate: string;
  _id: string;
};

export type CabinImageType = {
  _id: string;
  imageUrl: string;
  publicId: string;
};

export type CabinType = {
  _id: string;
  name: string;
  description: string;
  maxPersonsNumber: number;
  pricePerDay: number;
  isAllowed: boolean;

  mainImage: CabinImageType;
  images: CabinImageType[];

  reservationsDates: ReservationDateType[];

  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ResponseCabinType = {
  message: string;
  data: CabinType;
};

export type ResponseCabinsType = {
  message: string;
  data: CabinType[];
};
