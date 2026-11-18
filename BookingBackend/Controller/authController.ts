import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "../Handler/authHandler";
import { asyncHandler } from "../Utility/globalError";

export const login = asyncHandler(loginHandler);
export const register = asyncHandler(registerHandler);
export const logout = asyncHandler(logoutHandler);
export const refresh = asyncHandler(refreshHandler);
