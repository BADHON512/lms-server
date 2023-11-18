import { redis } from './../Utils/redis';
import { NextFunction,Response } from 'express';
import Errorhandler from "../Utils/Errorhandler"
import UserModel from '../models/userModels';


export const getUserById=async(id:string,res:Response,next:NextFunction)=>{
    try {
        const userJson=await redis.get(id)
        if(!userJson){
            return next(new Errorhandler('User not found this id',404))
        }
        const user=JSON.parse(userJson)
        res.status(201).json({
            success:true,
            user
        })
    } catch (error:any) {
        return next(new Errorhandler(error.message,404))
    }
}

// get all users
export const getAllUsersService= async(res:Response)=>{
    const users =await UserModel.find().sort({createdAt:-1})
    res.status(201).json({
        success:true,
        users
    })
}