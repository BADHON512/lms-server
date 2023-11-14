import { isAuthenticated } from './../middleware/auth';
import { RegistrationUser, activateUser, loginUser, logoutUser, authorizeRoles, updateAccessToken, getUserInfo, socialAuth, updateUserInfo, updatePassword } from './../controllers/userController';
import  express  from 'express';

const userRouter=express.Router()

userRouter.post('/registration',RegistrationUser)
userRouter.post('/activate-user',activateUser)
userRouter.post('/login',loginUser)
userRouter.get('/logout',isAuthenticated,logoutUser)
userRouter.get('/refresh',updateAccessToken)
userRouter.get('/me',isAuthenticated,getUserInfo)
userRouter.post('/social-auth',socialAuth)
userRouter.put('/update-user-info',isAuthenticated,updateUserInfo)
userRouter.post('/update-password',isAuthenticated,updatePassword)
export default userRouter

