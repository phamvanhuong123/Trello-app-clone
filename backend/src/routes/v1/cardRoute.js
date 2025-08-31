import express from 'express'
const route = express.Router()
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
route.route('/').post(cardValidation.createNew, cardController.createNew)

export const cardRoute = route