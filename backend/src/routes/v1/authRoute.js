import express from 'express'
import { authValidation } from '~/validations/authValidation'
import { authController } from '~/controllers/authController'
const Router = express.Router()

Router.post('/register', authValidation.createNew, authController.createNew)


export const authRoute = Router