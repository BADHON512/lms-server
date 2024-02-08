import { authorizeRoles, updateAccessToken } from "./../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { CreateOrder, getAllOrders } from "../controllers/order.controller";
import { accessTokenOptions } from "../Utils/jwt";


const OrderRouter= express.Router();
 
OrderRouter.post("/create-order",updateAccessToken,isAuthenticated,CreateOrder);           
OrderRouter.get("/get-all-orders",updateAccessToken, isAuthenticated,authorizeRoles('admin'),getAllOrders);           

export default OrderRouter;

