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
    let columnOrderIds = req.body.columnOrderIds

    if (typeof columnOrderIds === 'string') {
      try {
        columnOrderIds = JSON.parse(columnOrderIds)
      } catch (e) {
        columnOrderIds = []
      }
    }
    req.body.columnOrderIds = columnOrderIds
    req.body.image = req.file.filename ?? ''

    // Điều hướng sang tầng Service
    const createdBoard = await boardService.createBoard(req.body)

    //Có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}
const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const updateBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.updateBoard(boardId, req.body)

    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const moveCardBetweenDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardBetweenDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getAllBoards = async (req, res, next) => {
  try {
    // Nếu muốn có filter từ query params, ví dụ ?type=public
    const filter = {}
    if (req.query.type) {
      filter.type = req.query.type
    }

    const boards = await boardService.getAllBoards(filter)

    res.status(StatusCodes.OK).json(boards)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createBoard,
  getDetails,
  updateBoard,
  moveCardBetweenDifferentColumn,
  getAllBoards,
}
