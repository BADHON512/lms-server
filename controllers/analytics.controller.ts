import { NextFunction ,Request, Response,} from "express";
import { CatchAsyncErrors } from "../middleware/CatchAsyncErros";
import Errorhandler from "../Utils/Errorhandler";
import { generateLast12MonthsData } from "../Utils/analytics.generator";
import UserModel from "../models/userModels";
import OrderModel from "../models/orderModel";
import CourseModel from "../models/course.models";

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


export const getOrderAnalytics=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const orders=await generateLast12MonthsData(OrderModel)
        res.status(200).json({
            success:true,
            orders
        })
    } catch (error:any) {
       return next(new Errorhandler(error.message,404)) 
    }
})

export const getCourseAnalytics=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const course=await generateLast12MonthsData(CourseModel)
        res.status(200).json({
            success:true,
            course
        })
    } catch (error:any) {
       return next(new Errorhandler(error.message,404)) 
    }
})
