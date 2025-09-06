
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'


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
export const columnService = {
  createNew,
  update
}