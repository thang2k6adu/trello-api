import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createBoard = async (req, res, next) => {
  try {
    // console.log('req.body:', req.body)
    // console.log('req.query:', req.query)
    // console.log('req.params:', req.params)
    // console.log('req.files:', req.files)
    // console.log('req.cookies:', req.cookies)
    // console.log('req.jwtDecoded:', req.jwtDecoded)

    // Điều hướng sang tầng Service
    const createdBoard = await boardService.createBoard(req.body)

    //Có kết quả thì trả về phía Client
    res
      .status(StatusCodes.CREATED)
      .json(createdBoard)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createBoard,
}
