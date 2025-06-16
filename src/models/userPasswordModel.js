import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Tên collection
const USER_PASSWORD_COLLECTION_NAME = 'userPasswords'

// Joi schema
const USER_PASSWORD_COLLECTION_SCHEMA = Joi.object({
  user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  password: Joi.string().required(),
  loggedSessions: Joi.array().items(Joi.string()).default([]),
  emailVerified: Joi.boolean().default(false),
  emailToken: Joi.string().optional(),
  resetToken: Joi.string().optional(),
  removed: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
})

// Các field không được cập nhật
const INVALID_UPDATE_FIELDS = ['_id', 'user', 'createdAt']

// Validate trước khi tạo
const validateBeforeCreate = async (data) => {
  return await USER_PASSWORD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  })
}

// Tạo user password
const createUserPassword = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    validData.user = new ObjectId(validData.user)
    const result = await GET_DB()
      .collection(USER_PASSWORD_COLLECTION_NAME)
      .insertOne(validData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm theo userId
const findOneByUserId = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_PASSWORD_COLLECTION_NAME)
      .findOne({ user: new ObjectId(userId), removed: false })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Cập nhật thông tin
const updateUserPassword = async (userId, data) => {
  try {
    // Loại bỏ các field không hợp lệ
    Object.keys(data).forEach((field) => {
      if (INVALID_UPDATE_FIELDS.includes(field)) delete data[field]
    })

    data.updatedAt = Date.now()

    const result = await GET_DB()
      .collection(USER_PASSWORD_COLLECTION_NAME)
      .findOneAndUpdate(
        { user: new ObjectId(userId), removed: false },
        { $set: data },
        { returnDocument: 'after' }
      )

    if (!result.value) {
      throw new Error('User password not found')
    }

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

const updateLoggedSessions = async (userId, token) => {
  try {
    const result = await GET_DB()
      .collection(USER_PASSWORD_COLLECTION_NAME)
      .updateOne(
        { user: new ObjectId(userId), removed: false },
        { $push: { loggedSessions: token } }
      )

    if (result.matchedCount === 0) {
      throw new Error('User password not found')
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userPasswordModel = {
  USER_PASSWORD_COLLECTION_NAME,
  USER_PASSWORD_COLLECTION_SCHEMA,
  createUserPassword,
  findOneByUserId,
  updateUserPassword,
  updateLoggedSessions,
}
