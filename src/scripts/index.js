import '../pages/index.css';
import {
  addCard,
  changeAvatar,
  fetchUserProfile,
  loadCards,
  removeCard,
  removeLike,
  setLike,
  updateProfile,
} from './api.js';
import {createCard} from './card.js';
import {closeModal, openModal} from './modal.js';
import {activateValidation, resetValidationErrors} from './validation.js';

// Конфигурация для валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error',
};

// DOM-элементы
const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupProfile = document.querySelector('.popup_type_edit');
const popupAvatar = document.querySelector('.popup_type_avatar');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const formProfile = document.forms.editProfile;
const formCard = document.forms.newPlace;
const formAvatar = document.forms['avatar-form'];
const popupImage = document.querySelector('.popup_type_image');
const popupImageElementInPopup = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');

// Кнопки
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');

let userId;

// Функция для обработки лайков
function handleLike(cardId, isLiked, likeButton, likeCount) {
  const likeAction = isLiked ? removeLike : setLike;

  return likeAction(cardId)
    .then((updatedCard) => {
      likeCount.textContent = updatedCard.likes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch((err) => console.error(`Ошибка изменения лайка: ${err}`));
}

// Открытие попапа с изображением
function openPopupImage({link, name}) {
  popupImageElementInPopup.src = link;
  popupImageElementInPopup.alt = name;
  popupImageCaption.textContent = name;
  openModal(popupImage);
}

// Удаление карточки
function deleteCardCallback(cardId, cardElement) {
  removeCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => console.error(`Ошибка удаления карточки: ${err}`));
}

function setButtonTextToSaving(button) {
  button.textContent = 'Сохранение...';
}

function restoreButtonText(button, text) {
  button.textContent = text;
}

// Загрузка профиля и карточек
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
        deleteCardCallback,
        handleLike,
        openPopupImage,
        userId
      );
      placesList.append(createdCard);
    });
  })
  .catch((err) => console.error(`Ошибка загрузки данных: ${err}`));

// Открытие попапа редактирования профиля
if (profileEditButton) {
  profileEditButton.addEventListener('click', () => {
    formProfile.elements.name.value = profileTitle.textContent.trim();
    formProfile.elements.description.value = profileDescription.textContent.trim();
    resetValidationErrors(formProfile, validationConfig); // Передаём конфигурацию
    openModal(popupProfile);
  });
}

// Открытие попапа добавления карточки
if (addCardButton) {
  addCardButton.addEventListener('click', () => {
    formCard.reset();
    resetValidationErrors(formCard, validationConfig); // Передаём конфигурацию
    openModal(popupNewCard);
  });
}

// Открытие попапа изменения аватара
profileAvatar.addEventListener('click', () => {
  openModal(popupAvatar);
});

// Обновление профиля
formProfile.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const button = formProfile.querySelector(validationConfig.submitButtonSelector);
  setButtonTextToSaving(button);
  const name = formProfile.elements.name.value.trim();
  const about = formProfile.elements.description.value.trim();
  updateProfile(name, about)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(popupProfile);
    })
    .catch((err) => console.error(`Ошибка обновления профиля: ${err}`))
    .finally(() => {
      restoreButtonText(button, 'Сохранить');
    });
});

// Добавление карточки
formCard.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const button = formCard.querySelector(validationConfig.submitButtonSelector);
  setButtonTextToSaving(button);
  const name = formCard.elements['place-name'].value.trim();
  const link = formCard.elements.link.value.trim();
  addCard(name, link)
    .then((newCard) => {
      const createdCard = createCard(
        newCard,
        cardTemplate,
        deleteCardCallback,
        handleLike,
        openPopupImage,
        userId
      );
      placesList.prepend(createdCard);
      closeModal(popupNewCard);
    })
    .catch((err) => console.error(`Ошибка добавления карточки: ${err}`))
    .finally(() => {
      restoreButtonText(button, 'Сохранить');
    });
});

// Изменение аватара
formAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const button = formAvatar.querySelector(validationConfig.submitButtonSelector);
  setButtonTextToSaving(button);
  const avatar = formAvatar.elements.avatar.value.trim();
  changeAvatar(avatar)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(popupAvatar);
    })
    .catch((err) => console.error(`Ошибка обновления аватара: ${err}`))
    .finally(() => {
      restoreButtonText(button, 'Обновить');
    });
});

// Активация валидации
activateValidation(validationConfig);
