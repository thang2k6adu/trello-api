/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '~/utils/ApiError'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const createBoard = async (reqBody) => {
  try {
    const newBoard = {
      // Xử lí logic dữ liệu tùy đặc thù dự án
      ...reqBody,
      slug: slugify(reqBody.title),
    }

    // Gọi tới tầng Model để xử lí lưu bản ghi newBoard vào trong DB
    const createdBoard = await boardModel.createBoard(newBoard)

    // Lấy bản ghi Board sau khi tạo mới (tùy từng đặc thù dự án)
    const NewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // Làm thêm các logic khác với các collection tùy vào đặc thù của các dự án
    // Bắn email, notification về cho admin khi 1 cái board mới được tạo ...

    //trong Service luôn phải có return
    return NewBoard
  } catch (error) {
    throw error
  }
}
const getDetails = async (boardId) => {
  try {
    // Gọi tới tầng Model để xử lí lưu bản ghi newBoard vào trong DB
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Deep clone là tạo ra một cái hoàn toàn mới để xử lí
    // Không ảnh huongwr tới board ban đầu
    // Tùy mục đích về sau mà có thể quyết định clone deep hay không
    const resBoard = cloneDeep(board)
    // Đưa card về đúng column
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        (card) => card.columnId.toString() === column._id.toString()
      )
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const updateBoard = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    }
    const updatedBoard = await boardModel.updateBoard(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardBetweenDifferentColumn = async (reqBody) => {
  try {
    // Di chuyển card sang Column khác:
    // B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (bản chất là xóa id của card ra khỏi mảng)
    await columnModel.updateColumn(reqBody.prevColumnId, {
      // Lưu ý là cả prev và next đều đã được loại bỏ và thêm card được kéo vào ở front end nên không cần xử lí nhiều nữa
      // Về bản chất thì prev thực chất là cardOrderIds của column cũ không chứa card được kéo
      // Còn next thực chất là của column mới chứa card được kéo
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    })

    // B2: Cập nhật mảng cardOrderIds của Column tiếp theo (bản chất là thêm id của card mới vào)
    await columnModel.updateColumn(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    })

    // B3: Cập nhật lại trường columnId của card đã kéo
    await cardModel.updateCard(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
    })

    return { updateResult: 'Successfully!' }
  } catch (error) {
    throw error
  }
}

const getAllBoards = async (filter = {}) => {
  try {
    const boards = await boardModel.getAllBoards(filter)
    return boards
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createBoard,
  getDetails,
  updateBoard,
  moveCardBetweenDifferentColumn,
  getAllBoards,
}
