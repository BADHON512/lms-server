import { RegistrationUser, activateUser, loginUser } from './../controllers/userController';
import  express  from 'express';

const userRouter=express.Router()

userRouter.post('/registration',RegistrationUser)
userRouter.post('/activate-user',activateUser)
userRouter.post('/login',loginUser)

export default userRouter

