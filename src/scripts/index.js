import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, likeCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { activateValidation, resetValidationErrors, validateFormForEditing } from './validation.js';
import { fetchUserProfile } from './api.js';

// Переменные
const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');

const profileSection = document.querySelector('.profile');

const popupNewCard = document.querySelector('.popup_type_new-card');
const popupProfile = document.querySelector('.popup_type_edit');
const popupImage = document.querySelector('.popup_type_image');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

const formProfile = document.forms.editProfile;
const formCard = document.forms.newPlace;
fetchUserProfile()
  .then((userData) => {
    // Устанавливаем данные на страницу
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
  })
  .catch((err) => {
    console.error('Не удалось загрузить данные пользователя:', err);
  });

// Функции для работы с профилем
function getProfileInfo(form, title, description) {
  form.elements.name.value = title.textContent;
  form.elements.description.value = description.textContent;
  validateFormForEditing(form, validationConfig); // Валидация данных при подстановке
}

function setProfileInfo(form, title, description) {
  title.textContent = form.elements.name.value;
  description.textContent = form.elements.description.value;
}

// Инициализация карточек
initialCards.forEach((item) => {
  const createdCard = createCard(item, cardTemplate, deleteCard, likeCard, openModal, popupImage);
  placesList.append(createdCard);
});

// Слушатели для открытия модальных окон
profileSection.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('profile__add-button')) {
    resetValidationErrors(formCard, validationConfig); // Сброс ошибок перед открытием формы
    openModal(popupNewCard);
  }

  if (evt.target.classList.contains('profile__edit-button')) {
    getProfileInfo(formProfile, profileTitle, profileDescription);
    resetValidationErrors(formProfile, validationConfig); // Сброс ошибок перед открытием формы
    openModal(popupProfile);
  }
});

// Обработка формы профиля
formProfile.addEventListener('submit', (evt) => {
  evt.preventDefault();
  setProfileInfo(formProfile, profileTitle, profileDescription);
  closeModal(popupProfile);
});

// Обработка формы новой карточки
formCard.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const cardInfo = {
    name: formCard.elements['place-name'].value,
    link: formCard.elements.link.value,
  };

  const createdCard = createCard(cardInfo, cardTemplate, deleteCard, likeCard, openModal, popupImage);
  placesList.prepend(createdCard);

  closeModal(popupNewCard);
  evt.target.reset();
  resetValidationErrors(formCard, validationConfig); // Сброс ошибок после отправки формы
});

// Конфигурация для валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// Включаем валидацию для всех форм
activateValidation(validationConfig);
