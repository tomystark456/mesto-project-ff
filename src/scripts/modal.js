export function openModal(modalWindow) {
  modalWindow.classList.add('popup_is-animated');
  setTimeout(() => {
    modalWindow.classList.add('popup_is-opened');
  }, 1);
  modalWindow.addEventListener('mousedown', closeByOverlay);
  document.addEventListener('keydown', closeByEscape);
}

export function closeModal(modalWindow) {
  modalWindow.classList.remove('popup_is-opened');
  setTimeout(() => {
    modalWindow.classList.remove('popup_is-animated');
  }, 600);
  modalWindow.removeEventListener('mousedown', closeByOverlay);
  document.removeEventListener('keydown', closeByEscape);
}

function closeByOverlay(evt) {
  if (
    evt.target.classList.contains('popup') ||
    evt.target.classList.contains('popup__close')
  ) {
    closeModal(evt.currentTarget);
  }
}

function closeByEscape(evt) {
  if (evt.key === 'Escape') {
    const activeModal = document.querySelector('.popup_is-opened');
    if (activeModal) {
      closeModal(activeModal);
    }
  }
}
