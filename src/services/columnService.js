/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

const createColumn = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody,
    }

    const createdColumn = await columnModel.createColumn(newColumn)

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      // Xứ lí cấu trúc data trước khi trả dữ liệu về
      getNewColumn.cards = []

      // Cập nhật lại mảng OrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }


    return getNewColumn
  } catch (error) {
    throw error
  }
}

const updateColumn = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    }
    const updatedColumn = await columnModel.updateColumn(columnId, updateData)

    return updatedColumn
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createColumn,
  updateColumn,
}
