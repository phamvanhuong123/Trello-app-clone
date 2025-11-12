import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'


const createNew = async (req, res, next) => {
  try {
    const createUser = await authService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createUser)
  }
  catch (error) {
    next(error)
  }
}

export const authController = {
  createNew
}