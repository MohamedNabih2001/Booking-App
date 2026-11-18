export interface AuthDataType {
  token: string;
  id: string;
  name: string;
  role: string;
  email: string;
  theme: string;
}
export interface UserType {
  _id: string;
  name: string;
  role: string;
  email: string;
  theme: string;
  createdAt: string;
  updatedtedAt: string;
}
export interface RefereshResponseType {
  message: string;
  data: AuthDataType;
}
export interface MessageResponseType {
  message: string;
}
export interface ResponseUserType {
  message: string;
  data: UserType;
}
export interface ResponseUsersType {
  message: string;
  data: UserType[];
}
