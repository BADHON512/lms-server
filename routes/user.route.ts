import { isAuthenticated } from './../middleware/auth';
import { RegistrationUser, activateUser, loginUser, logoutUser, authorizeRoles, updateAccessToken, getUserInfo, socialAuth, updateUserInfo, updatePassword, updateProfilePicture, getAllUsers, updateUserRole, deleteUser } from './../controllers/userController';
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
userRouter.put('/update-profile',isAuthenticated,updateProfilePicture)
userRouter.put('/update-user-role',isAuthenticated,authorizeRoles('admin') ,updateUserRole)
userRouter.post('/update-password',isAuthenticated,updatePassword)
userRouter.get('/get-all-users',isAuthenticated,authorizeRoles('admin'),getAllUsers)
userRouter.get('/delete-users/:id',isAuthenticated,authorizeRoles('admin'),deleteUser)
export default userRouter

