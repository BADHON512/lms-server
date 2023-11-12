import { IUser } from './../models/userModels';
import { redis } from "./../Utils/redis";
import { Response, Request, NextFunction } from "express";
import { CatchAsyncErrors } from "./CatchAsyncErros";
import Errorhandler from "../Utils/Errorhandler";

require("dotenv").config();
import jwt, { JwtPayload } from "jsonwebtoken";

declare module 'express' {
    interface Request {
      user?: IUser;
    }
  }
  

export const isAuthenticated = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;
    console.log(req.cookies,"cookie")

    if (!access_token) {
      return next(
        new Errorhandler("Please login to access this resource", 404)
      );
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new Errorhandler("access token is invalid", 404));
    }

    const users:any = await redis.get(decoded.id);

 
    req.user = JSON.parse(users) 
    next();
  }
);
