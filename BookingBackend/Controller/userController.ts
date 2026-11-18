import {
  editUserDataHandler,
  getMeHandler,
  getUsersHandler,
  makeUserAdminOrUserHandler,
} from "../Handler/userHandler";
import { asyncHandler } from "../Utility/globalError";

export const updateData = asyncHandler(editUserDataHandler);
export const getMyInfo = asyncHandler(getMeHandler);
export const getUsers = asyncHandler(getUsersHandler);
export const makeAdmin = asyncHandler(makeUserAdminOrUserHandler);
