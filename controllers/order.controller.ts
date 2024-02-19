import ejs from "ejs";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncErrors } from "../middleware/CatchAsyncErros";
import Errorhandler from "../Utils/Errorhandler";
import UserModel from "../models/userModels";
import CourseModel from "../models/course.models";
import { getAllOrdersService, newOrder } from "../services/orderService";
import path from "path";
import sendMail from "../Utils/sendMail";
import NotificationModel from "../models/notificationModel";
import { redis } from "../Utils/redis";
require("dotenv").config(); 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

interface IOrder {
  courseId: string;
  payment_info: object;
}

export const CreateOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      if(payment_info){
        if('id' in payment_info ){
          const paymentID=payment_info.id
          const payment=await stripe.paymentIntents.retrieve(paymentID)
          if(payment.status===!"succeeded"){
            return next(new Errorhandler("Payment failed Payment not authorized", 404))
          }
          }
        
      }

      const user = await UserModel.findById(req.user?._id);
      if (!user) {
        return next(new Errorhandler("User not found", 404));
      }
      const courseExist = user.courses.some(
        (item: any) => item._id.toString() === courseId
      );
      if (courseExist) {
        return next(
          new Errorhandler("Course already purchased this account", 404)
        );
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new Errorhandler("Course not found", 404));
      }
      const data: any = {
        courseId: course._id,
        userId: user._id,
      };

      console.log(user.name, "username");
      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          customer: user.name,
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = ejs.renderFile(
        path.join(__dirname, "../mails/Order-comformation.ejs"),
        mailData
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "Order-comformation.ejs",
          data: mailData,
        });
      } catch (error: any) {
        return next(new Errorhandler(error.message, 404));
      }

      user.courses.push(course?._id);
      await redis.set(req.user?._id,JSON.stringify(user))

      course.purchased += 1;

      await course.save();

      await user.save();
      await NotificationModel.create({
        user: user._id,
        title: "New Order",
        message: `You have a new order form ${course?.name}`,
      });

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 404));
    }
  }
);

// get all users admin

export const getAllOrders = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 404));
    }
  }
);

// send stripe publishable key
export const sendStripePublishableKey = CatchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.status(200).json({
          success: true,
          publishableKey: process.env.SRIPE_TPUBLISHABLE_KEY,
        });
      } catch (error: any) {
        return next(new Errorhandler(error.message, 404));
      }
    }
)


// new payment
export const newPayment=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction )=>{
  try {
     const myPayment=await stripe.paymentIntents.create({
      amount:req.body.amount,
        currency:"USD",
        metadata:{
        company:" learn-with-badhon"
      },
    
      automatic_payment_methods:{
        enabled:true,
      }
     })

     res.status(201).json({
      success:true,
      client_secret:myPayment.client_secret,
     })
  } catch (error:any) {
    
    return next(new Errorhandler(error.message, 404));
  
  }
})
