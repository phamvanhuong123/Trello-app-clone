import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from './validators'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { ObjectId } from 'mongodb'
import { cardModel } from './cardModel'
import { columnModel } from './columnModel'
// define Collection (Name & Schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title : Joi.string().required().min(3).max(50).trim().strict(),
  description : Joi.string().required().min(3).max(50).trim().strict(),
  slug : Joi.string().required().min(3).trim().strict(),
  columnOrderIds : Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt : Joi.date().timestamp('javascript').default(Date.now),
  updatedAt : Joi.date().timestamp('javascript').default(null),
  _destroy : Joi.boolean().default(false),
  type : Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
})
// Chỉ định những trường mà ta không muốn cật nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const validateCreateBoard = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly : false })
}

const createNew = async (data) => {
  try {
    const validateData = await validateCreateBoard(data)
    const createNewBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validateData)
    return createNewBoard
  }
  catch (error) { throw new Error(error) }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id :new ObjectId(String(id)) })
    return result
  }
  catch (error) { throw new Error(error) }
}

// Sau này sẽ mở rộng getDetails
const getDetails = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match  : { _id :new ObjectId(String(id)), _destroy : false }
      },
      {
        $lookup : {
          from : columnModel.COLUMN_COLLECTION_NAME,
          localField : '_id',
          foreignField : 'boardId',
          as : 'columns'
        }
      },
      {
        $lookup : {
          from : cardModel.CARD_COLLECTION_NAME,
          localField : '_id',
          foreignField : 'boardId',
          as : 'cards'
        }
      }
    ]).toArray()
    return result[0] || null
  }
  catch (error) { throw new Error(error) }
}

// Thêm id của column vào trường OrderColumnIds
const pushColumnOrderIds = async(column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id : column.boardId },
      { $push : { columnOrderIds : new ObjectId(String(column._id)) } },
      { returnDocument : 'after' }
    )
    return result || null
  }
  catch (error) { throw new Error(error) }
}

const update = async (id, updateData) => {
  try {

    // Xoá bỏ những trường không cần thay đổi
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id : new ObjectId(String(id)) },
      { $set : updateData },
      { returnDocument : 'after' }
    )
    return result || null
  }
  catch (error) { throw new Error(error) }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  validateCreateBoard,
  getDetails,
  pushColumnOrderIds,
  update
}
// 68a085e73594206b22a61834