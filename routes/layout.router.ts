import { EditLayout, getLayout } from "./../controllers/layout.controller";
import { authorizeRoles } from "./../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { createLayout } from "../controllers/layout.controller";

const FaqRouter = express.Router();

FaqRouter.post(
  "/create-layout",
  // isAuthenticated,
  // authorizeRoles("admin"),
  createLayout
);
FaqRouter.put(
  "/edit-layout",
  isAuthenticated,
  authorizeRoles("admin"),
  EditLayout
);
FaqRouter.get("/get-layout/:type", getLayout);

export default FaqRouter;
