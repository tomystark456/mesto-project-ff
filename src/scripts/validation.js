export { activateValidation, resetValidationErrors, validateFormForEditing };

// Функция для активации валидации
const activateValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach((form) => {
    initializeEventListeners(form, config);
  });
};

// Функция для инициализации обработчиков событий на полях формы
const initializeEventListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      checkInputValidity(form, input, config);
      updateSubmitButtonState(inputs, submitButton, config);
    });
  });
};

// Функция проверки валидности ввода
const checkInputValidity = (form, input, config) => {
  const pattern = new RegExp(input.dataset.pattern || '.*');
  const errorText = input.dataset.errorMessage || 'Ошибка в поле';
  const maxLength = input.dataset.maxLength;

  if (input.validity.valueMissing) {
    displayInputError(form, input, 'Вы пропустили это поле.', config);
  } else if (input.type === 'url' && !input.validity.valid) {
    displayInputError(form, input, 'Введите адрес сайта.', config);
  } else if (input.value.length < 2) {
    displayInputError(form, input, 'Минимальная длина: 2 символа', config);
  } else if (maxLength && input.value.length > maxLength) {
    displayInputError(form, input, `Максимальная длина: ${maxLength} символов`, config);
  } else if (!pattern.test(input.value)) {
    displayInputError(form, input, errorText, config);
    input.setCustomValidity(errorText);
  } else {
    hideInputError(form, input, config);
    input.setCustomValidity('');
  }
};



// Функция для подготовки формы перед редактированием
const validateFormForEditing = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    checkInputValidity(form, input, config);
  });

  updateSubmitButtonState(inputs, submitButton, config);
};

// Функция отображения ошибки
const displayInputError = (form, input, message, config) => {
  let errorElement = form.querySelector(`#${input.id}-error`); // Ищем по ID

  // Если элемент ошибки не найден, создаем его
  if (!errorElement) {
    errorElement = document.createElement('span');
    errorElement.id = `${input.id}-error`;
    errorElement.classList.add(config.errorClass);
    input.insertAdjacentElement('afterend', errorElement); // Добавляем после поля ввода
  }

  input.classList.add(config.inputErrorClass);
  errorElement.textContent = message;
  errorElement.classList.add(config.errorClass);
};



// Функция скрытия ошибки
const hideInputError = (form, input, config) => {
  const errorElement = form.querySelector(`#${input.id}-error`);
  if (errorElement) {
    input.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
};


// Проверка наличия ошибок
const containsInvalidInput = (inputs) => {
  return inputs.some((input) => !input.validity.valid);
};

// Обновление состояния кнопки отправки
const updateSubmitButtonState = (inputs, button, config) => {
  if (containsInvalidInput(inputs)) {
    button.disabled = true;
    button.classList.add(config.inactiveButtonClass);
  } else {
    button.disabled = false;
    button.classList.remove(config.inactiveButtonClass);
  }
};

// Сброс ошибок валидации
const resetValidationErrors = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    hideInputError(form, input, config);
  });

  submitButton.disabled = true;
  submitButton.classList.add(config.inactiveButtonClass);
};
