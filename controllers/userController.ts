import { CatchAsyncErrors } from "./../middleware/CatchAsyncErros";
require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import UserModel, { IUser } from "../models/userModels";
import ErrorHandler from "../Utils/Errorhandler";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../Utils/sendMail";
import { sendToken } from "../Utils/jwt";
import { redis } from "../Utils/redis";


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
      }
      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;
      const data = { user:{badhon:user.name} , activationCode };
   
      // const html = await ejs.renderFile(
      //   path.join(__dirname, "../mails/Activation-mail.ejs"),
      //   data
      // );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your emil: ${user.email} to activate you account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
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
  return { token, activationCode };
};

interface IActivationRequest{
  activation_token:string,
  activation_code:string
}

export const activateUser=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
   try {
    const {activation_code,activation_token}=req.body as IActivationRequest 
    const newUser:{user:IUser;activationCode:string}=jwt.verify(activation_token,process.env.ACTIVATION_SECRET as Secret) as {user:IUser; activationCode:string}

    if(newUser.activationCode !==activation_code){
     return next(new ErrorHandler('Your OTP is wrong',400))
    }
    const {name,email,password}=newUser.user

  const existUser=await UserModel.findOne({email})
  if(existUser){
    return next(new ErrorHandler('Email already exist',400))
  }

  const user= await UserModel.create({
    name,email,password
  })

  res.status(201).json({
    success:true,
    message:"Login successfully"
  })
    
   } catch (error:any) {
    return next(new ErrorHandler(error.message, 400));
   }
     
})


// Login user
interface ILoginRequest{
  email:string,
  password:string
}

export const loginUser =CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {email,password}=req.body as ILoginRequest
    if(!email||!password){
      return next(new ErrorHandler('Please enter email and password', 400));
    }

    const user=await UserModel.findOne({email}).select('+password')
    if(!user){
      return next(new ErrorHandler('Invalid email and password', 400));
    }
    const isPasswordMatch= await user.comparePassword(password)
    if(!isPasswordMatch){
      return next(new ErrorHandler('Invalid email and password', 400));
    }
    sendToken(user,201,res)
  } catch (error:any) {
    return next(new ErrorHandler(error.message, 400));
  }
})


//logout user

export const logoutUser=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    res.cookie('access_token',"" ,{maxAge:1})
    res.cookie('refresh_token',"", {maxAge:1})
    const user=req.user?._id ||""
    redis.del(user)
    res.status(201).json({
      success:true,
      message:"Logout successfully"
    })
  } catch (error:any) {
    return next(new ErrorHandler(error.message, 400));
  }
})
