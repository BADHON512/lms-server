import { redis } from "./../Utils/redis";
import cloudinary from "cloudinary";
import { NextFunction } from "express";
import { Response } from "express";
import { Request } from "express";
import ejs from "ejs";

import { CatchAsyncErrors } from "../middleware/CatchAsyncErros";
import Errorhandler from "../Utils/Errorhandler";
import { CreateCourse } from "../services/course.services";
import CourseModel from "../models/course.models";
import mongoose from "mongoose";
import path from "path";
import sendMail from "../Utils/sendMail";
// upload course
export const uploadCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const photo = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: photo.public_id,
          url: photo.secure_url,
        };
      }

      CreateCourse(data, res, next);
    } catch (error: any) {
      next(new Errorhandler(error.message, 404));
    }
  }
);

// edit course

export const editCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        const photo = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "course",
        });

        data.thumbnail = {
          public_id: photo.public_id,
          url: photo.secure_url,
        };
      }

      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      next(new Errorhandler(error.message, 404));
    }
  }
);

// get single course with out purchasing

export const getSingleCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseID = req.params.id;
      const isCache = await redis.get(courseID);
      if (isCache) {
        const course = JSON.parse(isCache);
        console.log("hitted");
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.link"
        );

        await redis.set(courseID, JSON.stringify(course));
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      next(new Errorhandler(error.message, 404));
    }
  }
);

// get all course without purchasing

export const getAllCourse = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isExist = await redis.get("allCourses");
      if (isExist) {
        const course = JSON.parse(isExist);

        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        await redis.set("allCourses", JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      next(new Errorhandler(error.message, 404));
    }
  }
);

// get course content only for valid user

export const getCourseByUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseLists = req.user?.courses;

      const courseId = req.params.id;

      const courseExist = userCourseLists?.find((v: any) => v._id === courseId);

      if (!courseExist) {
        return next(
          new Errorhandler("You are not eligible to access this course", 404)
        );
      }

      const course = await CourseModel.findById(courseId);
      const content = course?.courseData;
      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 404));
    }
  }
);

// add question in course

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, contentId, courseId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new Errorhandler("Course not found", 404));
      }
      const courseContent = await course.courseData.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new Errorhandler("Content not found", 404));
      }
      // create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      //add this question to our course content
      courseContent.questions.push(newQuestion);

      await course?.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 404));
    }
  }
);

// add answer

interface IAddAnswerData {
  answer: string;
  questionId: string;
  courseId: string;
  contentId: string;
}

export const addAnswer = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, questionId, courseId, contentId }: IAddAnswerData =
        req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new Errorhandler("Course not found", 404));
      }
      const courseContent = await course?.courseData.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new Errorhandler("Content not found", 404));
      }
      // find the question in our course content
      const question = courseContent.questions.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new Errorhandler("Question not found", 404));
      }

      // create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };
      // add this answer to our question
      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question.user._id) {
        //create a notification for the user who asked the question
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/Question.reply.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "Question.reply.ejs",
            data,
          });
        } catch (error: any) {
          return next(new Errorhandler(error.message, 404));
        }
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 404));
    }
  }
);

// add review in course

interface IAddReviewData {
  review: string;
  rating: number;
  
}

export const addReview = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseLists = req.user?.courses;
      const courseId = req.params.id;

      // check if the course exists in the user's course lists
      const courseExist = userCourseLists?.some(
        (v: any) => v._id.toString() === courseId.toString()
      );

      if (!courseExist) {
        return next(
          new Errorhandler("You are not eligible to access this course", 404)
        );
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new Errorhandler("Course not found", 404));
      }
      const { review, rating } = req.body as IAddReviewData;
      const reviewData: any = {
        user: req.user,
        rating,
        comment: review,
      };
      course?.reviews.push(reviewData);

      let avg = 0;
      course.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });
      course.ratings = avg / course.reviews.length;
      await course?.save();
      const notification = {
        title: "New Review Received",
        message: `${req.user?.name} has review in ${course.name}`,
      };
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      next(new Errorhandler(error.message,404))
    }
  }
);

//add reply in review 
interface IAddReviewReply{
  comment:string,
  courseId:string,
  reviewId:string,
}

export const addReplyToReview=CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {comment,courseId,reviewId} =req.body as IAddReviewReply
    
    const course=await CourseModel.findById(courseId)
    if(!course){
      return next( new Errorhandler('course not found',404))
    }
    const review= course.reviews.find((item:any)=>item._id.toString()===reviewId.toString())
    if(!review){
      return next( new Errorhandler('review id  not found',404))
    }

    const replyData:any={
      user:req.user,
      comment
    }
    if(!review.commentReplies){
      review.commentReplies=[]
    }

    
   review.commentReplies.push(replyData)
    await course.save()

    res.status(200).json({
      success:true,
      course
    })
  } catch (error:any) {
    next(new Errorhandler(error.message,404))
  }
})
