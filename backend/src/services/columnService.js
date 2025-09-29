
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'


const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (id, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt : Date.now()
    }
    const updateColumn = await columnModel.update(id, updateData)
    return updateColumn
  } catch (error) { throw new Error(error)
  }
}
const deleteItem = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const targetColumn = await columnModel.findOneById(id)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found !')
    }

    // Xoá column
    const result = await columnModel.deleteOneById(id)

    // Xoá toàn bộ card của column
    await cardModel.deleteManyByColumnId(id)

    // Xoá idColumn của board
    await boardModel.pullColumnOrderIds(targetColumn)
    return result
  } catch (error) { throw new Error(error)
  }
}
export const columnService = {
  createNew,
  update,
  deleteItem
}