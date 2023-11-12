import { RegistrationUser, activateUser } from './../controllers/userController';
import  express  from 'express';

const userRouter=express.Router()

userRouter.post('/registration',RegistrationUser)
userRouter.post('/activate-user',activateUser)

export default userRouter

