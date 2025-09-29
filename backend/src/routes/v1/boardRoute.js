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

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)

// API hỗ trợ di chuyển card giữa các column khác nhau trong một board
Router.route('/supports/moving_card').put(boardValidation.moveCardDifferentColumn, boardController.moveCardDifferentColumn)

export const boardRoute = Router