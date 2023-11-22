import  ejs  from 'ejs';
require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleWare } from "./middleware/error";
import userRouter from "./routes/user.route";
import path from 'path';
import courseRouter from './routes/course.route';
import OrderRouter from './routes/order.route';
import notificationRouter from './routes/notification.route';
import AnalyticsRouter from './routes/user.analytics.route';
import FaqRouter from './routes/layout.router';



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

// routes
app.use('/api/v1',userRouter,courseRouter,OrderRouter,notificationRouter,AnalyticsRouter,FaqRouter)


app.get('/', (req: Request, res: Response, next: NextFunction) => {
  // Assuming user data is available, you can pass it as an object

  // Render the EJS template
  ejs.renderFile(path.join(__dirname, "./mails/Home.ejs"),  (err, html) => {
    if (err) {
      // Handle error, send an error response, or log the error
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Send the rendered HTML as the response
    res.send(html);
  });
});

app.get('/ejs-test',(req:Request,res:Response)=>{

  const badhon={
    name:'badhon',
    age:20
  }
  ejs.renderFile(path.join(__dirname, "./mails/Order-comformation.ejs"), badhon, (err, html) => {
    if (err) {
      // Handle error, send an error response, or log the error
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Send the rendered HTML as the response
    res.send(html);
  
  })
})

app.all('*',(req:Request,res:Response,next:NextFunction)=>{
    const err=new Error(`Route ${req.originalUrl} not found`)  as any 
    err.statusCode=400
    next(err)
})

//error handling
app.use(ErrorMiddleWare)
