import express from 'express'
import { isAuthenticated } from '../middleware/auth'
import { authorizeRoles } from '../controllers/userController'
import { getUserAnalytics } from '../controllers/analytics.controller'

const AnalyticsRouter=express.Router()

AnalyticsRouter.get('/get-user-analytics',isAuthenticated,authorizeRoles('admin'),getUserAnalytics)

export default AnalyticsRouter