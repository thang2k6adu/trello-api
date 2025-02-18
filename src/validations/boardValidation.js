import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {

  //Việc Validate dữ liệu BẮT BUỘB phải có ở phía Back-end vì đây là điều cuối để lưu trữ dữ liệu vào database
  //Nên vừa validate ở BE, vừa validate ở FE
  const correctValidation = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    desciption: Joi.string().required().min(3).max(256).trim().strict(),
  })

  try {
    // console.log('req.body:', req.body)
    // Chỉ định abortEarly: false trường hợp có nhiều lỗi không tắt sớm
    await correctValidation.validateAsync(req.body, { abortEarly: false })

    //  next()
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'POST: API create list boards' })
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    })
  }
}
export const boardValidation = {
  createNew,
}
