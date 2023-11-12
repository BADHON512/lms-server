import { IUser } from './../models/userModels';
import { Request } from 'express';

declare global{
    namespace Express{
        interface Request{
            user?:IUser
        }
    }
}