import { Response } from 'express';
import { NextFunction } from 'express';
import { Request } from 'express';
import { CatchAsyncErrors } from "../middleware/CatchAsyncErros";
import Errorhandler from '../Utils/Errorhandler';
import NotificationModel from '../models/notificationModel';


// get all notification ---only admin
export const getNotifications=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const notification= await NotificationModel.find().sort({createdAt:-1})
        res.status(201).json({
            success:true,
            notification
        })
    } catch (error:any) {
        return next(new Errorhandler(error.message,404))
        
    }
})