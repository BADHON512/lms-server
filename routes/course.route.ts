import { authorizeRoles } from "./../controllers/userController";
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
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
courseRouter.get("/get-single-course/:id", getSingleCourse);
courseRouter.get("/get-all-course", getAllCourse);
courseRouter.get("/get-all-courses",isAuthenticated,authorizeRoles('admin'),getAllCourses );
courseRouter.get("/course-delete/:id",isAuthenticated,authorizeRoles('admin'),deleteCourse );
courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser);
courseRouter.put("/add-question", isAuthenticated, addQuestion);
courseRouter.put("/add-answer", isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", isAuthenticated, addReview);
courseRouter.put("/add-review-reply",isAuthenticated,authorizeRoles('admin'),addReplyToReview);

export default courseRouter;
