import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Tên collection
const USER_COLLECTION_NAME = 'users'

// Schema validate bằng Joi
const USER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(1).max(255).trim().strict(),
  email: Joi.string().email().required().trim().strict(),
  country: Joi.string().required().trim().strict(),
  removed: Joi.boolean().default(false),
  enabled: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
})

// Schema validate cho update
const USER_UPDATE_SCHEMA = Joi.object({
  name: Joi.string().min(1).max(255).trim().strict(),
  email: Joi.string().email().trim().strict(),
  country: Joi.string().trim().strict(),
  enabled: Joi.boolean(),
  removed: Joi.boolean(),
  updatedAt: Joi.date().timestamp('javascript'),
})

// Những field không được cập nhật
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

// Validate trước khi tạo
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  })
}

// Validate trước khi update
const validateBeforeUpdate = async (data) => {
  return await USER_UPDATE_SCHEMA.validateAsync(data, {
    abortEarly: false,
  })
}

// Tạo user mới
const createUser = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    // Check for existing email
    const existingUser = await findOneByEmail(validData.email)
    if (existingUser) {
      throw new Error('Email already exists')
    }

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId), removed: false })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: email, removed: false })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateUser = async (userId, data) => {
  try {
    // Validate update data
    const validData = await validateBeforeUpdate(data)

    // Remove invalid fields
    Object.keys(validData).forEach((field) => {
      if (INVALID_UPDATE_FIELDS.includes(field)) delete validData[field]
    })

    // Add updatedAt timestamp
    validData.updatedAt = Date.now()

    // If email is being updated, check for duplicates
    if (validData.email) {
      const existingUser = await findOneByEmail(validData.email)
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error('Email already exists')
      }
    }

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId), removed: false },
        { $set: validData },
        { returnDocument: 'after' }
      )

    if (!result.value) {
      throw new Error('User not found')
    }

    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createUser,
  findOneById,
  findOneByEmail,
  updateUser,
}
