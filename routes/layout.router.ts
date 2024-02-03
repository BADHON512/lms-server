import { EditLayout, getLayout } from "./../controllers/layout.controller";
import { authorizeRoles, updateAccessToken } from "./../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { createLayout } from "../controllers/layout.controller";

const FaqRouter = express.Router();

FaqRouter.post(
  "/create-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  createLayout
);
FaqRouter.put(
  "/edit-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  EditLayout
);
FaqRouter.get("/get-layout/:type", getLayout);

export default FaqRouter;
