import { authorizeRoles } from "./../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { CreateOrder, getAllOrders } from "../controllers/order.controller";


const OrderRouter= express.Router();
 
OrderRouter.post("/create-order",isAuthenticated,CreateOrder);           
OrderRouter.get("/get-all-orders",isAuthenticated,authorizeRoles('admin'),getAllOrders);           

export default OrderRouter;

