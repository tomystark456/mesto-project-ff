import { openModal } from './modal.js';

export const createCard = (
  cardData,
  template,
  deleteCardCallback,
  setLikeCallback,
  removeLikeCallback,
  openPopupImageCallback,
  userId
) => {
  const cardElement = template.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  if (!likeCount) {
    console.error('Элемент для отображения лайков отсутствует в шаблоне карточки.');
    return;
  }

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Проверка лайков
  if (cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Удаление карточки
  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      deleteCardCallback(cardData._id, cardElement);
    });
  }

  // Лайки
  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const likeAction = isLiked ? removeLikeCallback : setLikeCallback;

    likeAction(cardData._id)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.toggle('card__like-button_is-active');
      })
      .catch((err) => console.error(`Ошибка изменения лайка: ${err}`));
  });

  // Открытие попапа с изображением
  cardImage.addEventListener('click', () => {
    openPopupImageCallback(cardData);
  });

  return cardElement;
};
