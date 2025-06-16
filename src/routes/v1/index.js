import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'
import { authRoutes } from './auth'

const Router = express.Router()

// Check api v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API V1 are ready to use' })
})

// Board APIs
Router.use('/boards', boardRoute)
// Column APIs
Router.use('/columns', columnRoute)
// Card APIs
Router.use('/cards', cardRoute)
// Auth APIs
Router.use('/auth', authRoutes)

export const APIs_V1 = Router
