require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

// cors=>cors origin policy

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);


app.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.send("<h1>SERVER IS WORKING</h1>")
   
})

app.all('*',(req:Request,res:Response,next:NextFunction)=>{
    const err=new Error(`Route ${req.originalUrl} not found`)  as any 
    err.statusCode=400
    next(err)
})
