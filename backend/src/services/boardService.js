import {slugify} from '~/utils/formatters'
const createNew = async (reqBody) => {
  try {
    const res = {
      ...reqBody,
      slug : slugify(reqBody.title)
    }
    return res
  } catch (error) {
    return error
  }
}

export const boardService = {
  createNew
}