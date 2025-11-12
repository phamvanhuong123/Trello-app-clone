import Joi from 'joi'

import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from './validators'


const USER_ROLE ={
  CLIENT : 'client',
  ADMIN : 'admin'
}
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email : Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE), //unique
  password : Joi.string().required(),
  username : Joi.string().required().trim().strict(),
  displayName : Joi.string().required().trim().strict(),
  avata : Joi.string().default(null),
  role : Joi.string().valid(USER_ROLE.ADMIN, USER_ROLE.CLIENT).default(USER_ROLE.CLIENT),
  isActive : Joi.boolean().default(false),
  verifyToken : Joi.string(),
  createdAt : Joi.date().timestamp('javascript').default(Date.now),
  updatedAt : Joi.date().timestamp('javascript').default(null),
  _destroy : Joi.boolean().default(false)
})

// INVALID_UPDATE_FIELD chỉ ra những trường không muốn cật nhật trong hàm update
const INVALID_UPDATE_FIELD = ['_id', 'email', 'username', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly : false })
}

const createNew = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data)
    const createUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validateData)
    return createUser
  }
  catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne( { _id : new ObjectId(String(userId)) })
    return result
  }
  catch (error) {
    throw new Error(error)
  }
}
const findOneByEmail = async ( email ) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne( { email : email })
    return result
  }
  catch (error) {
    throw new Error(error)
  }
}
const update = async (userId, updateData) => {
  try {
    // Loại bỏ những trường không cho cật nhập
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELD.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id : new ObjectId(String(userId)) },
      { $set : updateData },
      { returnDocument : 'after' }
    )
    return result
  }
  catch (error) {
    throw new Error(error)
  }
}
export const authModel = {
  createNew,
  findOneByEmail,
  findOneById,
  update
}