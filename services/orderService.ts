
import { Response,NextFunction } from 'express';

import { CatchAsyncErrors } from '../middleware/CatchAsyncErros';
import OrderModel from '../models/orderModel';


export const newOrder= CatchAsyncErrors(async(data:any, res:Response,next:NextFunction)=>{
    const order=await OrderModel.create(data);
    res.status(201).json({
        success:true,
        order
    })
})


// get all orders
export const getAllOrdersService= async(res:Response)=>{
    const orders =await OrderModel.find().sort({createdAt:-1})
    res.status(201).json({
        success:true,
        orders
    })
}