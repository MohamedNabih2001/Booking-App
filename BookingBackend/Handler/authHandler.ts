import { AppError } from "../Utility/AppError";
import { Request, NextFunction, Response } from "express";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  RESPONSE_CODES,
} from "../Utility/ErrorsType";
import validator from "validator";
import { User } from "../Model/userModel";
import {
  createAccessToken,
  createRefrehToken,
  createResetPasswordToken,
  refreshTokenCookiesOptions,
  verifyAccessToken,
  verifyRefrehToken,
  verifyRPToken,
} from "../Lib/tokens";
import { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../Service/emailService";
import bcrypt from "bcryptjs";
import { ERROR_MESSAGES } from "../Utility/ErrorsType";

////////////////////////////////////////////////////////////

export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userData = { ...req.body };
  if (
    !req.body ||
    !userData.name ||
    !userData.email ||
    !userData.password ||
    !userData.passwordConfirm
  ) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  ///////////////
  const isPasswordStrong = validator.isStrongPassword(userData.password);
  ///////////////
  const isPasswordCorrect = userData.password === userData.passwordConfirm;
  ///////////////
  const isEmailValid = validator.isEmail(userData.email);
  ///////////////
  if (!isPasswordCorrect || !isEmailValid || !isPasswordStrong) {
    return next(
      new AppError(ERROR_MESSAGES.INVALID_DATA, ERROR_CODES.INVALID_DATA),
    );
  }

  ////////////////////////////////////////////
  const exists = await User.exists({
    email: userData.email,
  });

  if (exists) {
    return next(
      new AppError(ERROR_MESSAGES.DUPLICATE_DATA, ERROR_CODES.DUPLICATE_DATA),
    );
  }
  ///////////////
  const role = "user";
  ////////////////////////////
  const theme = "light";
  ////////////////////////////
  const user = await User.create({
    ...userData,
    role,
    theme,
    refreshToken: null,
  });
  ////////////////////////////
  const payload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role,
  };
  ////////////////////////////
  const refreshToken = createRefrehToken(payload);
  const accessToken = createAccessToken(payload);
  //////////////////////////////////
  await User.findByIdAndUpdate(payload.id, { refreshToken });
  ////////////////////////////////////////////

  res.cookie(
    "refreshTokenBookingApp",
    refreshToken,
    refreshTokenCookiesOptions,
  );

  ////////////////////////////////////////////
  res.status(RESPONSE_CODES.CREATED).json({
    message: "user created successfuly",
    data: { ...payload, token: accessToken, theme },
  });
}

///////////////////////////////////////

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userData = { ...req.body };
  if (!req.body || !userData.email || !userData.password) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  ///////////////////////////
  const userExist = await User.findOne({
    email: userData.email,
  }).select("+password");

  if (!userExist) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }

  ///////////////////////

  const isPasswordCorrect = await userExist.checkPassword(userData.password);

  ///////////////////////
  if (!isPasswordCorrect) {
    return next(
      new AppError(ERROR_MESSAGES.INVALID_DATA, ERROR_CODES.INVALID_DATA),
    );
  }

  ////////////////////////////////////////////
  const payload = {
    id: userExist._id.toString(),
    name: userExist.name,
    email: userExist.email,
    role: userExist.role,
  };
  ////////////////////////////
  const refreshToken = createRefrehToken(payload);
  const accessToken = createAccessToken(payload);
  //////////////////////////////////
  await User.findByIdAndUpdate(payload.id, { refreshToken });

  ////////////////////////////////////////////

  res.cookie(
    "refreshTokenBookingApp",
    refreshToken,
    refreshTokenCookiesOptions,
  );

  ////////////////////////////////////////////
  res.status(RESPONSE_CODES.OK).json({
    message: "login successfuly",
    data: { ...payload, token: accessToken, theme: userExist.theme },
  });
}
////////////////////////////////////////////////////////////

export async function logoutHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user.id;

  ////////////////////////////////////////////
  const userExist = await User.findById(userId);

  if (!userExist) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  ////////////////////////////
  const user = await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 },
  });
  ////////////////////////////
  res.clearCookie("refreshTokenBookingApp", refreshTokenCookiesOptions);

  ////////////////////////////////////////////
  res.status(RESPONSE_CODES.OK).json({
    message: "logout successfuly",
  });
}
////////////////////////////////////////////////////////////

export async function authMe(req: Request, res: Response, next: NextFunction) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  const accessToken = req.headers.authorization?.split(" ")[1];
  ////////////////////////////////////////////
  let decoded: JwtPayload | null = null;
  if (accessToken) {
    decoded = verifyAccessToken(accessToken) as JwtPayload;
  }
  if (!decoded) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  console.log("access", decoded);
  ////////////////////////////
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  ////////////////////////////
  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
  next();
}
////////////////////////////////////////////////////////////

export async function refreshHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const refreshOldToken = req.cookies.refreshTokenBookingApp;
  let decoded: JwtPayload | null = null;
  if (refreshOldToken) {
    decoded = verifyRefrehToken(refreshOldToken) as JwtPayload;
  }
  if (!decoded) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  console.log("refresh", decoded);
  ////////////////////////////////////////////

  const userId = decoded.id;
  if (!userId) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  ////////////////////////////
  const user = await User.findById(userId).select("+refreshToken");

  if (!user) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }

  if (user.refreshToken !== refreshOldToken) {
    res.clearCookie("refreshTokenBookingApp", refreshTokenCookiesOptions);
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }

  ////////////////////////////////////////////

  const payload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
  ////////////////////////////
  const refreshToken = createRefrehToken(payload);
  const accessToken = createAccessToken(payload);
  //////////////////////////////////
  await User.findByIdAndUpdate(payload.id, { refreshToken });

  ////////////////////////////////////////////

  res.cookie(
    "refreshTokenBookingApp",
    refreshToken,
    refreshTokenCookiesOptions,
  );

  ////////////////////////////////////////////
  res.status(RESPONSE_CODES.OK).json({
    message: "refresh successfuly",
    data: { ...payload, token: accessToken, theme: user.theme },
  });
}

////////////////////////////////////////////////////////////

export async function restrictToAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id, role } = req.user;
  console.log(req.user);
  if (role !== "admin") {
    return next(new AppError(ERROR_MESSAGES.FORBIDDEN, ERROR_CODES.FORBIDDEN));
  }
  ////////////////////////////
  const user = await User.findById(id);

  if (!user) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  if (user.role !== "admin") {
    return next(new AppError(ERROR_MESSAGES.FORBIDDEN, ERROR_CODES.FORBIDDEN));
  }
  ////////////////////////////
  next();
}
////////////////////////////////////////////////////////////

export async function forgetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError(ERROR_MESSAGES.INVALID_DATA, ERROR_CODES.INVALID_DATA),
    );
  }
  const resetPassToken = createResetPasswordToken({ email });
  const hashedToken = await bcrypt.hash(resetPassToken, 12);
  const newUser = await User.findByIdAndUpdate(user._id, {
    resetPasswordToken: hashedToken,
  });
  await sendEmail({
    to: email,
    subject: "Booking App reset forget Password",
    html: `
        <h1>Hello 👋</h1>
        <p>Click here to reset your password</p>
        <a href="http://localhost:5173/forget/setNewPassword?token=${resetPassToken}">Password Reset</a>
        
        <p>This link will expire in 25 minutes.</p>

      `,
  });

  res.json({
    message: "Email sent successfully",
  });
}
////////////////////////////////////////////////////////////

export async function validateTokenResetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { token } = req.body;
  let email;
  try {
    const decoded = verifyRPToken(token);
    email = decoded.email;
  } catch (e) {
    return next(
      new AppError(
        ERROR_MESSAGES.VALIDATION_ERROR,
        ERROR_CODES.VALIDATION_ERROR,
      ),
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError(ERROR_MESSAGES.INVALID_DATA, ERROR_CODES.INVALID_DATA),
    );
  }
  if (!user.resetPasswordToken) {
    return next(
      new AppError(
        ERROR_MESSAGES.VALIDATION_ERROR,
        ERROR_CODES.VALIDATION_ERROR,
      ),
    );
  }

  const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
  if (isTokenValid) {
    res.json({
      message: "Token is valid please enter your new password ",
      data: { validation: true },
    });
  }
}

////////////////////////////////////////////////

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { token, password } = req.body;
  let email;
  try {
    const decoded = verifyRPToken(token);
    email = decoded.email;
  } catch (e) {
    return next(
      new AppError(
        ERROR_MESSAGES.VALIDATION_ERROR,
        ERROR_CODES.VALIDATION_ERROR,
      ),
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError(ERROR_MESSAGES.INVALID_DATA, ERROR_CODES.INVALID_DATA),
    );
  }
  if (!user.resetPasswordToken) {
    return next(
      new AppError(
        ERROR_MESSAGES.VALIDATION_ERROR,
        ERROR_CODES.VALIDATION_ERROR,
      ),
    );
  }

  const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
  if (isTokenValid) {
    const newPasswordHashed = await bcrypt.hash(password, 12);
    const newUser = await User.findByIdAndUpdate(user._id, {
      $set: { password: newPasswordHashed },
      $unset: {
        resetPasswordToken: "",
      },
    });
    res.json({
      message: "New Password is reset  ",
    });
  }
}
