import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import { authorizeRoles } from '../controllers/userController'
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from '../controllers/analytics.controller'

const AnalyticsRouter=express.Router()

AnalyticsRouter.get('/get-user-analytics',isAuthenticated,authorizeRoles('admin'),getUserAnalytics)
AnalyticsRouter.get('/get-order-analytics',isAuthenticated,authorizeRoles('admin'),getOrderAnalytics)
AnalyticsRouter.get('/get-course-analytics',isAuthenticated,authorizeRoles('admin'),getCourseAnalytics)

export default AnalyticsRouter