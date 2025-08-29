import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { BOARD_TYPE } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createBoard = async (req, res, next) => {
  //Việc Validate dữ liệu BẮT BUỘC phải có ở phía Back-end vì đây là điều cuối để lưu trữ dữ liệu vào database
  //Nên vừa validate ở BE, vừa validate ở FE
  const correctValidation = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().min(3).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
  }).unknown(true) // cho phép thêm field ngoài schema nếu cần

  try {
    // Chỉ định abortEarly: false trường hợp có nhiều lỗi không tắt sớm
    await correctValidation.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp sang controller
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const updateBoard = async (req, res, next) => {
  // Update không require
  const correctValidation = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
  })

  try {
    // Update cho phép unknown field
    await correctValidation.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    })
    // Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp sang controller
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const moveCardBetweenDifferentColumn = async (req, res, next) => {
  const correctValidation = Joi.object({
    currentCardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
    nextColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
  })

  try {
    await correctValidation.validateAsync(req.body, {
      abortEarly: false,
    })
    // Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp sang controller
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const boardValidation = {
  createBoard,
  updateBoard,
  moveCardBetweenDifferentColumn,
}
