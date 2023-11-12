import { isAuthenticated } from './../middleware/auth';
import { RegistrationUser, activateUser, loginUser, logoutUser } from './../controllers/userController';
import  express  from 'express';

const userRouter=express.Router()

userRouter.post('/registration',RegistrationUser)
userRouter.post('/activate-user',activateUser)
userRouter.post('/login',loginUser)
userRouter.get('/logout',isAuthenticated,logoutUser)

export default userRouter

