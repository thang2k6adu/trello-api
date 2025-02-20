/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      // Xử lí logic dữ liệu tùy đặc thù dự án
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lí lưu bản ghi newBoard vào trong DB
    //...

    // Làm thêm các logic khác với các collection tùy vào đặc thù của các dự án
    // Bắn email, notification về cho admin khi 1 cái board mới được tạo ...

    //trong Service luôn phải có return
    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
}
