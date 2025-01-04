import { openModal } from './modal.js';

export const createCard = (
  cardData,
  template,
  deleteCard,
  setLike,
  removeLike,
  userId
) => {
  const cardElement = template.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count'); // Проверяем наличие элемента

  if (!likeCount) {
    console.error('Элемент для отображения лайков отсутствует в шаблоне карточки.');
    return;
  }

  const deleteButton = cardElement.querySelector('.card__delete-button');

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Проверка лайков
  if (cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Удаляем кнопку удаления, если карточка не принадлежит пользователю
  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    // Обработчик удаления карточки
    deleteButton.addEventListener('click', () => {
      deleteCard(cardData._id)
        .then(() => cardElement.remove())
        .catch((err) => console.error(`Ошибка удаления карточки: ${err}`));
    });
  }

  // Обработчик лайка
  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const likeAction = isLiked ? removeLike : setLike;

    likeAction(cardData._id)
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.toggle('card__like-button_is-active');
      })
      .catch((err) => console.error(`Ошибка изменения лайка: ${err}`));
  });

  // Открытие изображения в попапе
  cardImage.addEventListener('click', () => {
    const popupImage = document.querySelector('.popup_type_image');
    const popupImageElement = popupImage.querySelector('.popup__image');
    const popupCaption = popupImage.querySelector('.popup__caption');

    popupImageElement.src = cardData.link;
    popupImageElement.alt = cardData.name;
    popupCaption.textContent = cardData.name;

    openModal(popupImage);
  });

  return cardElement;
};
