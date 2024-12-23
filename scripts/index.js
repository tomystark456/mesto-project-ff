const cardsPlace = document.querySelector('.places__list');
const deleteSelf = e => e.target.closest('.places__item').remove();

const createCard = function (cardData, deleteCallback) {

  const template = document.querySelector('#card-template').content;
  const card = template.querySelector('.places__item').cloneNode(true);

  const cardImage = card.querySelector('.card__image');
  const cardDescription = card.querySelector('.card__description').querySelector('.card__title');
  const cardRemoveButton = card.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardDescription.textContent = cardData.name;

  cardRemoveButton.onclick = e => deleteCallback(e);

  return card;
}

initialCards.forEach(e => cardsPlace.append(createCard(e, deleteSelf)));