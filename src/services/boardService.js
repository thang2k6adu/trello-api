/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

const createBoard = async (reqBody) => {
  try {
    const newBoard = {
      // Xử lí logic dữ liệu tùy đặc thù dự án
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lí lưu bản ghi newBoard vào trong DB
    const createdBoard = await boardModel.createBoard(newBoard)
    console.log(createdBoard)

    // Làm thêm các logic khác với các collection tùy vào đặc thù của các dự án
    // Bắn email, notification về cho admin khi 1 cái board mới được tạo ...

    //trong Service luôn phải có return
    return createdBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createBoard,
}
