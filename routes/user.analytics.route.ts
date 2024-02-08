import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import { authorizeRoles, updateAccessToken } from '../controllers/userController'
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from '../controllers/analytics.controller'

const AnalyticsRouter=express.Router()

AnalyticsRouter.get('/get-user-analytics',updateAccessToken,isAuthenticated,authorizeRoles('admin'),getUserAnalytics)
AnalyticsRouter.get('/get-order-analytics',updateAccessToken,isAuthenticated,authorizeRoles('admin'),getOrderAnalytics)
AnalyticsRouter.get('/get-course-analytics',updateAccessToken,isAuthenticated,authorizeRoles('admin'),getCourseAnalytics)

export default AnalyticsRouter