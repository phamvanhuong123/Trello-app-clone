import express from 'express'
const Router = express.Router()
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message : 'API get list post'
    })
  })
  .post(boardValidation.createNew, boardController.createNew)

export const boardRoute = Router