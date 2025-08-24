import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'


const createNew = async (req, res, next) => {
  //lưu ý trim() phải có strict()
  const correctCondition = Joi.object({
    title : Joi.string().required().min(3).max(50).trim().strict().messages({
      'string.empty': 'Dữ liệu không được để trống',
      'string.min': 'Dữ liệu ít nhất 3 kí tự',
      'string.max': 'Dữ liệu ít nhất 50 kí tự',
      'string.trim': 'Dữ liệu không được để trống'
    }),
    description : Joi.string().required().min(3).max(256).trim().strict(),
    type : Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })
  try {
    // console.log(req.body)
    // set abortEarly : false để kiểm tra trường hợp có nhiều lỗi thì trả về tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly : false })
    next()
  } catch (error) {
    // console.log(error)
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const boardValidation = {
  createNew
}