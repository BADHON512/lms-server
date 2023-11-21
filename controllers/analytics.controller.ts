import { NextFunction ,Request, Response,} from "express";
import { CatchAsyncErrors } from "../middleware/CatchAsyncErros";
import Errorhandler from "../Utils/Errorhandler";
import { generateLast12MonthsData } from "../Utils/analytics.generator";
import UserModel from "../models/userModels";

export const getUserAnalytics=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const users=await generateLast12MonthsData(UserModel)
        res.status(200).json({
            success:true,
            users
        })
    } catch (error:any) {
       return next(new Errorhandler(error.message,404)) 
    }
})