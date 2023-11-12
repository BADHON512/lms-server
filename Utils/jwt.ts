import { Response } from "express";
import { redis } from "./redis";
import { IUser } from "./../models/userModels";
require("dotenv").config();

interface iTokenOption {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | undefined;
  secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // upload session to redis
  redis.set(user._id, JSON.stringify(user) as any);

  const accessTokenExp = parseInt(process.env.ACCESS_TOKEN_EXP || "300", 10);
  const refreshTokenExp = parseInt(process.env.REFRESH_TOKEN_EXP || "1200", 10);

  //option for cookie
 console.log(accessTokenExp * 1000)
  const accessTokenOptions: iTokenOption = {
    expires: new Date(Date.now() + accessTokenExp + 1000),
    maxAge: accessTokenExp * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  const refreshTokenOptions: iTokenOption = {
    expires: new Date(Date.now() + refreshTokenExp + 1000),
    maxAge: refreshTokenExp * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(201).json({
    success: true,
    user,
    accessToken,
  });
};
