import { Response } from 'express';
import { NextFunction } from 'express';
import { Request } from 'express';
import { CatchAsyncErrors } from "../middleware/CatchAsyncErros";
import Errorhandler from '../Utils/Errorhandler';
import NotificationModel from '../models/notificationModel';
import corn from 'node-cron'


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

// update notification

export const updateNotification=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{

    try {
     const notification=await NotificationModel.findById(req.params.id)
     if(!notification){
        return next(new Errorhandler('Notification not found',404))
     }else{
        notification.status?(notification.status='read'):(notification.status)
     }
     await notification.save()

     const notifications=await NotificationModel.find().sort({createdAt:-1})

     res.status(201).json({
        success:true,
        notifications
     })


        
    } catch (error:any) {
        return next(new Errorhandler(error.message,404))
    }
})


corn.schedule('0 0 0 * * *',async()=>{
    const thirtyDaysAgo=new Date(Date.now()-30*24*60*60*1000)
    await NotificationModel.deleteMany({status:'read',createdAt:{$lt:thirtyDaysAgo}})
})