const imagePopup = document.querySelector('.popup__image');
const paragraphPopup = document.querySelector('.popup__caption');

// Функция для создания карточки
export function createCard(
  imageAttr, // Объект с данными карточки (имя и ссылка на изображение)
  cardTemplate, // Шаблон карточки
  deleteCardCallback, // Колбэк для удаления карточки
  likeCardCallback, // Колбэк для лайка карточки
  openCardCallback, // Колбэк для открытия модального окна
  modalWindow, // Ссылка на модальное окно
  setImageAttr, // Функция для обновления содержимого popup с изображением
) {

  // Копируем шаблон карточки
  const cardElement = cardTemplate.querySelector('.places__item.card').cloneNode(true);

  // Получаем элементы карточки
  const cardTitle = cardElement.querySelector('.card__title'); // Заголовок карточки
  const cardImage = cardElement.querySelector('.card__image'); // Изображение карточки
  const deleteButton = cardElement.querySelector('.card__delete-button'); // Кнопка удаления
  const likeButton = cardElement.querySelector('.card__like-button'); // Кнопка лайка

  // Устанавливаем данные карточки
  cardTitle.textContent = imageAttr.name; // Имя карточки
  cardImage.src = imageAttr.link; // Ссылка на изображение
  cardImage.alt = imageAttr.name; // Альтернативный текст изображения

  // Добавляем обработчики событий
  deleteButton.addEventListener('click', () => deleteCardCallback(cardElement)); // Удаление карточки
  likeButton.addEventListener('click', () => likeCardCallback(cardElement)); // Смена состояния лайка
  cardImage.addEventListener('click', () => {
    // Устанавливаем данные в popup только при открытии
    setImageAttr(cardImage.src, cardImage.alt, imagePopup, paragraphPopup);
    openCardCallback(modalWindow); // Открытие popup
  });

  return cardElement; // Возвращаем созданный элемент карточки
}

// Функция для удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove(); // Удаление элемента из DOM
}

// Функция для переключения состояния лайка
export function likeCard(cardElement) {
  const likeButton = cardElement.querySelector('.card__like-button');

  // Добавляем или удаляем активный класс
  likeButton.classList.toggle('card__like-button_is-active');
}
