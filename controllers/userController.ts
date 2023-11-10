import { CatchAsyncErrors } from "./../middleware/CatchAsyncErros";
require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/userModels";
import ErrorHandler from "../Utils/Errorhandler";
import jwt, { Secret } from "jsonwebtoken";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const RegistrationUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const IsEmailExist = await UserModel.findOne({ email });
      if (IsEmailExist) {
        return next(new ErrorHandler("This email already exist", 400));

        const user: IRegistrationBody = {
          name,
          email,
          password,
        };

        const activationToken = createActivationToken(user);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return {token,activationCode}
};
