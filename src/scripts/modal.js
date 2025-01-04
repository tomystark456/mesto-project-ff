export function openModal(modalWindow) {
  const closeButton = modalWindow.querySelector('.popup__close'); // Находим кнопку закрытия

  // Добавляем класс для анимации открытия
  modalWindow.classList.add('popup_is-animated');

  // Открываем модальное окно с небольшой задержкой для плавности анимации
  setTimeout(() => {
    modalWindow.classList.add('popup_is-opened');
    if (closeButton) {
      closeButton.focus(); // Устанавливаем фокус на кнопку закрытия
      // Добавляем обработчик для кнопки закрытия
      closeButton.addEventListener('click', () => closeModal(modalWindow));
    }
  }, 1);

  // Добавляем обработчики событий для закрытия модального окна
  modalWindow.addEventListener('mousedown', closeByOverlay); // Закрытие по клику на оверлей
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
  modalWindow.removeEventListener('mousedown', closeByOverlay); // Удаляем обработчик закрытия по оверлею
  document.removeEventListener('keydown', closeByEscape); // Удаляем обработчик закрытия по Escape

  // Удаляем обработчик для кнопки закрытия
  const closeButton = modalWindow.querySelector('.popup__close');
  if (closeButton) {
    closeButton.removeEventListener('click', () => closeModal(modalWindow));
  }
}

// Обработчик: закрытие модального окна по клику на оверлей
function closeByOverlay(evt) {
  if (evt.target.classList.contains('popup') && !evt.target.closest('.popup__content')) {
    closeModal(evt.target.closest('.popup'));
  }
}

// Обработчик: закрытие модального окна по нажатию клавиши Escape
function closeByEscape(evt) {
  if (evt.key === 'Escape') {
    const activeModal = document.querySelector('.popup_is-opened');
    if (activeModal) {
      closeModal(activeModal);
    }
  }
}

// Добавляем обработчик для открытия модального окна изменения аватара
export function addProfileImageClickHandler(profileImageSelector, modalWindow) {
  const profileImage = document.querySelector(profileImageSelector);
  if (profileImage) {
    profileImage.addEventListener('click', () => openModal(modalWindow));
  }
}

export function handleAvatarFormSubmit(form, profileAvatar, apiUpdateAvatar) {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const submitButton = form.querySelector('.popup__button');
    const avatarInput = form.querySelector('#avatar-url');
    const errorElement = form.querySelector(`#${avatarInput.id}-error`);

    // Проверяем валидность URL
    if (!avatarInput.validity.valid) {
      errorElement.textContent = avatarInput.dataset.errorMessage || 'Введите корректный URL';
      avatarInput.classList.add('popup__input_type_error');
      return;
    } else {
      errorElement.textContent = '';
      avatarInput.classList.remove('popup__input_type_error');
    }

    submitButton.textContent = 'Сохранение...';

    apiUpdateAvatar(avatarInput.value)
      .then((updatedData) => {
        profileAvatar.style.backgroundImage = `url(${updatedData.avatar})`;
        closeModal(form.closest('.popup'));
        form.reset();
      })
      .catch((err) => {
        console.error('Ошибка обновления аватара:', err);
      })
      .finally(() => {
        submitButton.textContent = 'Обновить';
      });
  });
}
