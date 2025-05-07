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
  .get((req, res) => {
    boardController.getDetails(req, res)
  })
  .put((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'PUT: API update board by id' })
  })
  .delete((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'DELETE: API delete board by id' })
  })
export const boardRoute = Router
