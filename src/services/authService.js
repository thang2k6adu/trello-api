import jwt from 'jsonwebtoken'
import Joi from 'joi'
import { verifyPassword, hashPassword } from '~/utils/password'
import { userModel } from '~/models/userModel'
import { userPasswordModel } from '~/models/userPasswordModel'
import { env } from '~/config/environment'

const login = async ({ email, password, remember }) => {
  // 1. Kiểm tra tồn tại user
  const user = await userModel.findOneByEmail(email)
  if (!user || user.removed) {
    const error = new Error('No account with this email has been registered')
    error.status = 404
    throw error
  }

  // 2. Kiểm tra user có bị disable không
  if (!user.enabled) {
    const error = new Error('Account is disabled')
    error.status = 403
    throw error
  }

  // 3. Lấy thông tin mật khẩu
  const userPassword = await userPasswordModel.findOneByUserId(user._id)
  if (!userPassword || userPassword.removed) {
    const error = new Error('Password record not found')
    error.status = 500
    throw error
  }

  // 4. So sánh password
  const isMatch = verifyPassword(password, userPassword.password)
  if (!isMatch) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  // 5. Tạo Token
  // console.log(env.JWT_SECRET)
  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: remember ? '365d' : '24h',
  })

  // 6. Tạo refresh token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '30d',
    }
  )

  // 7. Ghi lại logged session
  await userPasswordModel.updateLoggedSessions(user._id, token)

  // 8. Trả dữ liệu
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
    refreshToken,
  }
}

const register = async ({ name, email, password, country }) => {
  // 1. Validate dữ liệu đầu vào
  const objectSchema = Joi.object({
    name: Joi.string().required().min(2).max(255),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      }),
    country: Joi.string().required().min(2).max(100),
  })

  const { error } = objectSchema.validate({ name, email, password, country })
  if (error) {
    error.status = 409
    throw error
  }

  // 2. Kiểm tra email đã tồn tại chưa
  const existingUser = await userModel.findOneByEmail(email)
  if (existingUser) {
    const error = new Error('An account with this email already exists')
    error.status = 409
    throw error
  }

  // 3. Hash mật khẩu
  const { passwordHash } = hashPassword(password)

  // 4. Tạo verification token
  // console.log(env.JWT_SECRET)
  const verificationToken = jwt.sign(
    { email },
    process.env.JWT_VERIFICATION_SECRET,
    { expiresIn: '24h' }
  )

  // 5. Tạo user
  const userData = {
    name,
    email,
    country,
    enabled: true,
    removed: false,
  }
  const { insertedId: userId } = await userModel.createUser(userData)

  // 6. Lưu password
  const userPasswordData = {
    // Tostring to avoild ObjectId
    user: userId.toString(),
    password: passwordHash,
    loggedSessions: [],
    emailVerified: false,
    emailToken: verificationToken,
    removed: false,
  }
  await userPasswordModel.createUserPassword(userPasswordData)

  // 7. Gửi email xác thực (implement later)
  // await sendVerificationEmail(email, verificationToken)

  // 8. Trả thông tin
  const newUser = await userModel.findOneById(userId)
  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    country: newUser.country,
    message:
      'Registration successful. Please check your email to verify your account.',
  }
}

const logout = async (userId, token) => {
  try {
    await userPasswordModel.removeLoggedSession(userId, token)
    return { message: 'Logged out successfully' }
  } catch (error) {
    error.status = 500
    throw error
  }
}

const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await userModel.findOneById(decoded.id)

    if (!user || user.removed || !user.enabled) {
      throw new Error('Invalid refresh token')
    }

    const newToken = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: '24h',
    })

    return {
      token: newToken,
      refreshToken,
    }
  } catch (error) {
    error.status = 401
    throw error
  }
}

export const authService = {
  login,
  register,
  logout,
  refreshToken,
}
