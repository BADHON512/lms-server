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

interface IOrder {
  courseId: string;
  payment_info: object;
}

export const CreateOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

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

      user.courses.push(course._id);

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
