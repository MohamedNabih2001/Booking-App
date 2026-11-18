import jwt, { SignOptions } from "jsonwebtoken";
import { getEnv } from "../Utility/GetEnv";
import { CookieOptions } from "express";
import { AppError } from "../Utility/AppError";
import { ERROR_CODES, ERROR_MESSAGES } from "../Utility/ErrorsType";

////////////////////////////////////////

interface PayloadTokenType {
  name: string;
  email: string;
  role: string;
  id: string;
}

////////////////////////////////////////

export const refreshTokenCookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 3600 * 1000,
};

////////////////////////////////////////

const optionRefreshToken: SignOptions = {
  expiresIn: "7d",
};

////////////////////////////////////////

const optionsAccessToken: SignOptions = {
  expiresIn: "15m",
};
////////////////////////////////////////

const optionsRPToken: SignOptions = {
  expiresIn: "25m",
};

////////////////////////////////////////

export function createRefrehToken(payload: PayloadTokenType) {
  const refreshTokenSecret = getEnv("REFRESH_TOKEN_SECRET");
  const refreshToken = jwt.sign(
    payload,
    refreshTokenSecret,
    optionRefreshToken,
  );
  return refreshToken;
}

////////////////////////////////////////

export function createAccessToken(payload: PayloadTokenType) {
  const accessTokenSecret = getEnv("ACCESS_TOKEN_SECRET");
  const accessToken = jwt.sign(payload, accessTokenSecret, optionsAccessToken);
  return accessToken;
}

////////////////////////////////////////
export function createResetPasswordToken(payload: { email: string }) {
  const resetPassTokenSecret = getEnv("RP_TOKEN_SECRET");
  const token = jwt.sign(payload, resetPassTokenSecret, optionsRPToken);
  return token;
}

////////////////////////////////////////

export function verifyRefrehToken(token: string) {
  try {
    const refreshTokenSecret = getEnv("REFRESH_TOKEN_SECRET");
    const decoded = jwt.verify(token, refreshTokenSecret);
    return decoded;
  } catch (e) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}

////////////////////////////////////////

export function verifyAccessToken(token: string) {
  try {
    const accessTokenSecret = getEnv("ACCESS_TOKEN_SECRET");
    const decoded = jwt.verify(token, accessTokenSecret);
    return decoded;
  } catch (e) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}
////////////////////////////////////////

export function verifyRPToken(token: string) {
  try {
    const resetPasswordTokenSecret = getEnv("RP_TOKEN_SECRET");
    const decoded = jwt.verify(token, resetPasswordTokenSecret);
    return decoded as { email: string };
  } catch (e) {
    throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}
