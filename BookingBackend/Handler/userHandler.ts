import { AppError } from "../Utility/AppError";
import { Request, NextFunction, Response } from "express";
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  RESPONSE_CODES,
} from "../Utility/ErrorsType";
import { User } from "../Model/userModel";
import { refreshTokenCookiesOptions } from "../Lib/tokens";
import bcrypt from "bcryptjs";

export async function editUserDataHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id, role } = req.user;
  if (!req.body) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  const userData = { ...req.body };

  ////////////////////////////
  const user = await User.findById(id).select("+password");

  if (!user) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }

  if (userData.password && !userData.oldPassword) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  let newUserData;
  if (userData.password && userData.oldPassword) {
    const isSamePassword = await user.checkPassword(userData.oldPassword);
    if (!isSamePassword) {
      res.clearCookie("refreshTokenBookingApp", refreshTokenCookiesOptions);
      return next(
        new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
      );
    }
    const newPass = await bcrypt.hash(userData.password, 12);
    newUserData = await User.findByIdAndUpdate(
      user._id,
      { password: newPass },
      { returnDocument: "after" },
    );
    console.log("newPass", newPass);
    res
      .status(RESPONSE_CODES.OK)
      .json({ message: "Data updated successfully", data: newUserData });
  } else {
    newUserData = await User.findByIdAndUpdate(user._id, userData, {
      returnDocument: "after",
    });

    res
      .status(RESPONSE_CODES.OK)
      .json({ message: "Data updated successfully", data: newUserData });
  }
}
////////////////////////////////////////////////////////////

export async function makeUserAdminOrUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  const data = req.body;

  if (!id) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  if (!req.body) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }
  ////////////////////////////
  const user = await User.findById(id);

  if (!user) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }

  const newUserData = await User.findByIdAndUpdate(id, data, {
    returnDocument: "after",
  });

  res
    .status(RESPONSE_CODES.OK)
    .json({ message: "Data updated successfully", data: newUserData });
}

/////////////////////////////////////////////////////////////

export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user.id;
  if (!userId) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  ////////////////////////////
  const user = await User.findById(userId);
  if (!user) {
    return next(
      new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED),
    );
  }
  ////////////////////////////
  res
    .status(RESPONSE_CODES.OK)
    .json({ message: "get your inforamtion successfully", data: user });
}

///////////////////////////////////////

export async function getUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  ////////////////////////////
  const { searchName } = req.query;

  const filter = searchName
    ? {
        name: {
          $regex: String(searchName),
          $options: "i",
        },
      }
    : {};

  const users = await User.find(filter).limit(12);
  if (!users) {
    return next(new AppError(ERROR_MESSAGES.CONFLICT, ERROR_CODES.CONFLICT));
  }
  ////////////////////////////
  res
    .status(RESPONSE_CODES.OK)
    .json({ message: "get your inforamtion successfully", data: users });
}

///////////////////////////////////////
