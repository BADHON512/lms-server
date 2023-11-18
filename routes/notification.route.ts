import { authorizeRoles } from "./../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { getNotifications } from "../controllers/notification.controller";



const notificationRouter= express.Router();
 
notificationRouter.post("/get-all-notification",isAuthenticated,authorizeRoles('admin'),getNotifications);           

export default notificationRouter;