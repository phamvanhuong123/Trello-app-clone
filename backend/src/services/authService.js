import { StatusCodes } from 'http-status-codes'
import { authModel } from '~/models/authModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
const createNew = async (reqBody) => {
  try {
    // Kiểm tra email có tồn tại hay không
    const exsistUser = await authModel.findOneByEmail(reqBody.email)
    if (exsistUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists in database')
    }
    //Tạo data để lưu vào database
    // Tách username từ email
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email : reqBody.email,
      password : bcrypt.hashSync(reqBody.password, 8), //tham số thư 2 là độ phúc tạp giá trị càng cao thì độ phúc tạp càng lâu
      username : nameFromEmail,
      displayName : nameFromEmail,
      verifyToken : uuidv4()
    }
    const createUser = await authModel.createNew(newUser)
    const getNewUser = await authModel.findOneById(createUser.insertedId)
    //Gửi email cho phía người dùng
    return pickUser(getNewUser)
  }
  catch (error) {
    throw error
  }
}
export const authService = {
  createNew
}