// Настройки для работы с API
import { apiSettings } from './apiConfig.js';

// Проверяем ответ от сервера
const checkServerResponse = (res) => {
  if (res.ok) {
    return res.json(); // Если запрос успешный, возвращаем данные
  }
  return Promise.reject(`Что-то пошло не так: ${res.status}`); // Ошибка
};

// Получаем данные о текущем пользователе
export const fetchUserProfile = () => {
  return fetch(`${apiSettings.baseUrl}/users/me`, {
    headers: apiSettings.headers,
  }).then(checkServerResponse); // Используем правильное имя функции
};

// Загружаем список всех карточек
