import  ejs  from 'ejs';
import { Request,Response,NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/CatchAsyncErros";
import Errorhandler from "../Utils/Errorhandler";
import UserModel from "../models/userModels";
import CourseModel from "../models/course.models";
import { newOrder } from "../services/orderService";
import path from 'path';


interface IOrder{
    courseId:string;
    payment_info:object
}

export const CreateOrder=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {courseId,payment_info}=req.body as IOrder;

        const user =await UserModel.findById(req.user?._id)
        if(!user){
            return next(new Errorhandler("User not found",404))
        
        }
        const courseExist=await user.courses.some((item:any)=>item._id.toString()===courseId)
        if(!courseExist){
            return next(new Errorhandler("Course already purchased this account",404))
        
        }

        const course= await CourseModel.findById(courseId)
        if(!course){
         return next(new Errorhandler("Course not found",404))
        }
        const data:any={
            course:course._id,
            userId:user._id,
        }

        newOrder(data,res,next)

        const mailData={
            order:{
                _id:course._id.slice(0,6),
                name:course.name,
                price:course.price,
                date:new Date().toLocaleDateString('en-US',{year:"numeric",month:"long",day:"numeric"})
            }
        }

        const html= ejs.renderFile(path.join(__dirname,'../mails/Order-comformation.ejs'),mailData)
        
    } catch (error:any) {
        return  next(new Errorhandler(error.message,404))
    }
})