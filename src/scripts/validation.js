// Активируем валидацию для всех форм
export const activateValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {
    initializeEventListeners(form, config);
  });
};

// Инициализация обработчиков для формы
const initializeEventListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      checkInputValidity(form, input, config);
      toggleSubmitButtonState(inputs, submitButton, config);
    });
  });
};

// Проверяем валидность ввода
const checkInputValidity = (form, input, config) => {
  // Устанавливаем кастомное сообщение для patternMismatch
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage || 'Введите корректное значение.');
  } else {
    input.setCustomValidity(''); // Сбрасываем кастомное сообщение
  }

  // Проверяем общее состояние валидности поля
  if (input.validity.valid) {
    hideInputError(form, input, config); // Скрываем ошибку, если поле валидно
  } else {
    displayInputError(form, input, input.validationMessage, config); // Показываем стандартное сообщение об ошибке
  }
};


// Показываем ошибку
const displayInputError = (form, input, errorMessage, config) => {
  let errorElement = form.querySelector(`#${input.id}-error`);

  // Если элемент ошибки отсутствует, создаем его
  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.id = `${input.id}-error`;
    errorElement.classList.add(config.errorClass);
    input.insertAdjacentElement('afterend', errorElement);
  }

  input.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

// Скрываем ошибку
const hideInputError = (form, input, config) => {
  const errorElement = form.querySelector(`#${input.id}-error`);
  if (errorElement) {
    input.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
};

// Проверяем, есть ли ошибки в полях
const hasInvalidInput = (inputs) => {
  return inputs.some((input) => !input.validity.valid);
};

// Переключаем состояние кнопки отправки
const toggleSubmitButtonState = (inputs, submitButton, config) => {
  if (hasInvalidInput(inputs)) {
    submitButton.classList.add(config.inactiveButtonClass);
    submitButton.disabled = true;
  } else {
    submitButton.classList.remove(config.inactiveButtonClass);
    submitButton.disabled = false;
  }
};

// Сбрасываем ошибки перед открытием формы
export const resetValidationErrors = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => hideInputError(form, input, config));
  toggleSubmitButtonState(inputs, submitButton, config);
};
