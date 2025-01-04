import '../pages/index.css';
import {
  fetchUserProfile,
  loadCards,
  addCard,
  updateProfile,
  changeAvatar,
  removeCard,
  setLike,
  removeLike,
} from './api.js';
import { createCard } from './card.js';
import { openModal, closeModal, addProfileImageClickHandler, handleAvatarFormSubmit } from './modal.js';

import {
  activateValidation,
  resetValidationErrors,
  validateFormForEditing,
} from './validation.js';

const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');
const profileSection = document.querySelector('.profile');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupProfile = document.querySelector('.popup_type_edit');
const popupAvatar = document.querySelector('.popup_type_avatar');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const formProfile = document.forms.editProfile;
const formCard = document.forms.newPlace;
const formAvatar = document.forms['avatar-form'];

// Добавляем обработчик для клика по картинке профиля
if (profileAvatar) {
  addProfileImageClickHandler('.profile__image', popupAvatar);
  handleAvatarFormSubmit(formAvatar, profileAvatar, changeAvatar);
}

let userId;

Promise.all([fetchUserProfile(), loadCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((card) => {
      const createdCard = createCard(
        card,
        cardTemplate,
        removeCard,
        setLike,
        removeLike,
        userId
      );
      placesList.append(createdCard);
    });
  })
  .catch((err) => console.error(`Ошибка загрузки данных: ${err}`));

function setProfileInfo(form) {
  const name = form.elements.name.value.trim();
  const about = form.elements.description.value.trim();
  const submitButton = form.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  updateProfile(name, about)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(popupProfile);
    })
    .catch((err) => console.error(`Ошибка обновления профиля: ${err}`))
    .finally(() => {
      submitButton.textContent = initialText;
    });
}

function setAvatar(form) {
  const avatarUrl = form.elements.avatar.value.trim();
  const submitButton = form.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  changeAvatar(avatarUrl)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(popupAvatar);
      form.reset();
    })
    .catch((err) => console.error(`Ошибка обновления аватара: ${err}`))
    .finally(() => {
      submitButton.textContent = initialText;
    });
}

function addNewCard(form) {
  const name = form.elements['place-name'].value.trim();
  const link = form.elements.link.value.trim();
  const submitButton = form.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  addCard(name, link)
    .then((newCard) => {
      const createdCard = createCard(
        newCard,
        cardTemplate,
        removeCard,
        setLike,
        removeLike,
        userId
      );
      placesList.prepend(createdCard);
      closeModal(popupNewCard);
      form.reset();
    })
    .catch((err) => console.error(`Ошибка добавления карточки: ${err}`))
    .finally(() => {
      submitButton.textContent = initialText;
    });
}

if (profileSection) {
  profileSection.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('profile__add-button')) {
      resetValidationErrors(formCard, validationConfig);
      openModal(popupNewCard);
    }

    if (evt.target.classList.contains('profile__edit-button')) {
      formProfile.elements.name.value = profileTitle.textContent;
      formProfile.elements.description.value = profileDescription.textContent;
      resetValidationErrors(formProfile, validationConfig);
      openModal(popupProfile);
    }
  });
}

formProfile.addEventListener('submit', (evt) => {
  evt.preventDefault();
  setProfileInfo(formProfile);
});

formCard.addEventListener('submit', (evt) => {
  evt.preventDefault();
  addNewCard(formCard);
});

formAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();
  setAvatar(formAvatar);
});

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error',
};

activateValidation(validationConfig);
