export function openModal(modalWindow) {
  const closeButton = modalWindow.querySelector('.popup__close'); // Находим кнопку закрытия

  // Добавляем класс для анимации открытия
  modalWindow.classList.add('popup_is-animated');

  // Открываем модальное окно с небольшой задержкой для плавности анимации
  setTimeout(() => {
    modalWindow.classList.add('popup_is-opened');
    closeButton.focus(); // Устанавливаем фокус на кнопку закрытия
  }, 1);

  // Добавляем обработчики событий для закрытия модального окна
  modalWindow.addEventListener('click', closeByButton); // Закрытие по кнопке
  modalWindow.addEventListener('click', closeByOverlay); // Закрытие по клику на оверлей
  document.addEventListener('keydown', closeByEscape); // Закрытие по нажатию клавиши Escape
}

export function closeModal(modalWindow) {
  // Удаляем класс открытия для начала анимации закрытия
  modalWindow.classList.remove('popup_is-opened');

  // Удаляем класс анимации через 600 мс (время завершения CSS-анимации)
  setTimeout(() => {
    modalWindow.classList.remove('popup_is-animated');
  }, 600);

  // Удаляем обработчики событий
  modalWindow.removeEventListener('click', closeByButton); // Удаляем обработчик закрытия по кнопке
  modalWindow.removeEventListener('click', closeByOverlay); // Удаляем обработчик закрытия по оверлею
  document.removeEventListener('keydown', closeByEscape); // Удаляем обработчик закрытия по Escape
}

// Обработчик: закрытие модального окна по кнопке
function closeByButton(evt) {
  if (evt.target.classList.contains('popup__close')) {
    closeModal(getActiveModal());
  }
}

// Обработчик: закрытие модального окна по клику на оверлей
function closeByOverlay(evt) {
  if (evt.target.classList.contains('popup')) {
    closeModal(getActiveModal());
  }
}

// Обработчик: закрытие модального окна по нажатию клавиши Escape
function closeByEscape(evt) {
  if (evt.key === 'Escape') {
    closeModal(getActiveModal());
  }
}

// Функция для получения активного модального окна
function getActiveModal() {
  return document.querySelector('.popup_is-opened'); // Возвращает текущий открытый popup
}
