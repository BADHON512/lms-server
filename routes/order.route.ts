import { authorizeRoles } from "./../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { CreateOrder } from "../controllers/order.controller";


const OrderRouter= express.Router();
 
OrderRouter.post("/create-order",isAuthenticated,CreateOrder);           

export default OrderRouter;

