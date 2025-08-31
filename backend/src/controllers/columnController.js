import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).json({
      message : 'create new list column',
      data : createdColumn
    })
  }
  catch (error) {next(error)}

}


export const columnController = {
  createNew
}