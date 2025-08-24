import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
// import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Test error')
    const createNewBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.OK).json({
      message : 'create new list board',
      data : createNewBoard
    })
  }
  catch (error) {next(error)}
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json({
      message : '',
      data : board
    })
  }
  catch (error) {next(error)}
}
export const boardController = {
  createNew,
  getDetails
}