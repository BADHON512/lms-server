import { NextFunction } from 'express';
import { Request, Response } from 'express';
import Errorhandler from "../Utils/Errorhandler";

export const ErrorMiddleWare=(err:any,req:Request,res:Response,next:NextFunction)=>{
    err.statusCode=err.statusCode||500
    err.message=err.message||'Internal Server Error'

    if(err.name==='CastError'){
        const message=`Resource not found Invalid:${err.path}`
        err=new Errorhandler(message,400)
    }
    if(err.name===11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} entered`
        err=new Errorhandler(message,400)
    }

    if(err.name==='JsonWebTokenError'){
        const message=`Json web token is Invalid try again`
        err=new Errorhandler(message,400)
    }

    if(err.name==='TokenExpiresError'){
        const message= 'Json web token is expires try again'
        err=new Errorhandler(message,400)
    }

    res.status(err.statusCode).json({
      success:true,
      message:err.message
    })

}