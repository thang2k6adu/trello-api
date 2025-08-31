import express from 'express'
import { authController } from '~/controllers/authController'

const router = express.Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
// router.post('/forgot-password', authController.forgotPassword)
// router.post('/reset-password', authController.resetPassword)
router.get('verify-email', authController.verifyEmail)

export const authRoutes = router