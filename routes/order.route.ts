import { authorizeRoles, updateAccessToken } from "./../controllers/userController";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { CreateOrder, getAllOrders, newPayment, sendStripePublishableKey } from "../controllers/order.controller";
import { accessTokenOptions } from "../Utils/jwt";


const OrderRouter= express.Router();
 
OrderRouter.post("/create-order",updateAccessToken,isAuthenticated,CreateOrder);           
OrderRouter.get("/get-all-orders",updateAccessToken, isAuthenticated,authorizeRoles('admin'),getAllOrders);  

OrderRouter.get('/payment/stripepublishableky',sendStripePublishableKey)

OrderRouter.post('/payment',isAuthenticated,newPayment)

export default OrderRouter;

