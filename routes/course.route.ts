import { authorizeRoles, updateAccessToken } from "./../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAllCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.post(
  "/getVideoOtp",
  // isAuthenticated,
  // authorizeRoles("admin"),
  generateVideoUrl
);
courseRouter.put(
  "/course-edit/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
courseRouter.get("/get-single-course/:id",   getSingleCourse);
courseRouter.get("/get-all-course",  getAllCourse);
courseRouter.get("/get-all-courses",  updateAccessToken,isAuthenticated,authorizeRoles('admin'),getAllCourses );
courseRouter.delete("/course-delete/:id",  updateAccessToken,isAuthenticated,authorizeRoles('admin'),  updateAccessToken,deleteCourse );
courseRouter.get("/get-course-content/:id",   isAuthenticated, getCourseByUser);
courseRouter.put("/add-question",  updateAccessToken, isAuthenticated, addQuestion);
courseRouter.put("/add-answer",  updateAccessToken, isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id",  updateAccessToken, isAuthenticated, addReview);
courseRouter.put("/add-review-reply",  updateAccessToken,isAuthenticated,addReplyToReview);

export default courseRouter;
