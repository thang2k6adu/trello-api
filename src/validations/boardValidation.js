import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { BOARD_TYPE } from '~/utils/constants'

const createBoard = async (req, res, next) => {
  //Việc Validate dữ liệu BẮT BUỘC phải có ở phía Back-end vì đây là điều cuối để lưu trữ dữ liệu vào database
  //Nên vừa validate ở BE, vừa validate ở FE
  const correctValidation = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
  })

  try {
    // Chỉ định abortEarly: false trường hợp có nhiều lỗi không tắt sớm
    await correctValidation.validateAsync(req.body, { abortEarly: false })
    // Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp sang controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
export const boardValidation = {
  createBoard,
}
