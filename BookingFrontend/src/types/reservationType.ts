export type ReservationType = {
  _id: string;
  daysNumber: number;
  cabinId: { name: string };
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  expireTime: string;
  sessionUrl: string;
  sessionId: string;
  userId: string;
  id: string;
  paidStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ReservationResponseType = {
  message: string;
  data: ReservationType;
  paymentUrl: string;
};
export type ReservationsGetResponseType = {
  message: string;
  data: ReservationType[];
};
export type ReservationGetResponseType = {
  message: string;
  data: ReservationType;
};
export type ResponseMessageType = {
  message: string;
};
