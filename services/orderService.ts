import { NextFunction } from 'express';
import { CatchAsyncErrors } from '../middleware/CatchAsyncErros';
import OrderModel from '../models/orderModel';


export const newOrder= CatchAsyncErrors(async(data:any,next:NextFunction)=>{
    const order=await OrderModel.create(data);
    next(order);
})