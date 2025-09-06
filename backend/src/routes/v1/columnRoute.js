import express from 'express'
const route = express.Router()
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
route.route('/').post(columnValidation.createNew, columnController.createNew)
route.route('/:id').put(columnValidation.update, columnController.update)

export const columnRoute = route