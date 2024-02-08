import { authorizeRoles, updateAccessToken } from "./../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { getNotifications, updateNotification } from "../controllers/notification.controller";



const notificationRouter= express.Router();
 
notificationRouter.get("/get-all-notification",updateAccessToken,isAuthenticated,authorizeRoles('admin'),getNotifications);           
notificationRouter.put("/notification-update/:id",updateAccessToken,isAuthenticated,authorizeRoles('admin'),updateNotification);           

export default notificationRouter;