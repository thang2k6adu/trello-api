import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })
  .post(boardValidation.createBoard, boardController.createBoard)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.updateBoard, boardController.updateBoard)
  .delete((req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ message: 'DELETE: API delete board by id' })
  })

// API hỗ trợ việc di chuyển card giữa 2 column khác nhau
Router.route('/supports/moving_card')
  .put(boardValidation.moveCardBetweenDifferentColumn, boardController.moveCardBetweenDifferentColumn)

export const boardRoute = Router
