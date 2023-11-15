import { authorizeRoles } from './../controllers/userController';
import  express  from 'express';
import { isAuthenticated } from '../middleware/auth';
import { editCourse, getAllCourse, getCourseByUser, getSingleCourse, uploadCourse } from '../controllers/course.controller';

const courseRouter=express.Router()

courseRouter.post('/create-course',isAuthenticated,authorizeRoles('admin'),uploadCourse)
courseRouter.put('/course-edit/:id',isAuthenticated,authorizeRoles('admin'),editCourse)
courseRouter.get('/get-single-course/:id',getSingleCourse)
courseRouter.get('/get-all-course',getAllCourse)
courseRouter.get('/get-course-content/:id',isAuthenticated,getCourseByUser)


export default courseRouter
