/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
const createCard = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
    }

    const createdCard = await cardModel.createCard(newCard)

    const NewCard = await cardModel.findOneById(createdCard.insertedId)

    if (NewCard) {
      await columnModel.pushCardOrderIds(NewCard)
    }

    return NewCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createCard
}
