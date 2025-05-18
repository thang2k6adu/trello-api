import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'

const Router = express.Router()

Router.route('/').post(
  columnValidation.createColumn,
  columnController.createColumn
)

Router.route('/:id')
  .put(columnValidation.updateColumn, columnController.updateColumn)

export const columnRoute = Router
