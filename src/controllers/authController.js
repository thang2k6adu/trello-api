import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      result,
      message: 'Successfully logged in'
    })
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      result,
      message: 'Account created successfully. Please verify your email'
    })
  } catch (error) {
    next(error)
  }
}

export const authController = {
  login,
  register
}
