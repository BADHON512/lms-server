import { Response } from 'express';
import { CatchAsyncErrors } from "../middleware/CatchAsyncErros";
import CourseModel from '../models/course.models';
//create course



export const CreateCourse=CatchAsyncErrors(async(data:any,res:Response)=>{
    const course=await CourseModel.create(data)
    res.status(201).json({
        success:true,
        course
    })
})