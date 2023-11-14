import { IUser } from './../models/userModels';
declare module 'express' {
    interface Request {
      user?: IUser;
    }
  }
  