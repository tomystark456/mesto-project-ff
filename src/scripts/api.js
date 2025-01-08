// Настройки API
import {apiSettings} from './apiConfig.js';

// Универсальная функция проверки ответа сервера
const checkServerResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Получаем данные пользователя
export const fetchUserProfile = () => {
  return fetch(`${apiSettings.baseUrl}/users/me`, {
    headers: apiSettings.headers,
  }).then(checkServerResponse);
};

// Загружаем карточки
export const loadCards = () => {
  return fetch(`${apiSettings.baseUrl}/cards`, {
    headers: apiSettings.headers,
  }).then(checkServerResponse);
};

// Обновляем профиль
export const updateProfile = (name, about) => {
  return fetch(`${apiSettings.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: apiSettings.headers,
    body: JSON.stringify({name, about}),
  }).then(checkServerResponse);
};

// Добавляем новую карточку
export const addCard = (name, link) => {
  return fetch(`${apiSettings.baseUrl}/cards`, {
    method: 'POST',
    headers: apiSettings.headers,
    body: JSON.stringify({name, link}),
  }).then(checkServerResponse);
};

// Удаляем карточку
export const removeCard = (cardId) => {
  return fetch(`${apiSettings.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: apiSettings.headers,
  }).then(checkServerResponse);
};

// Ставим лайк
export const setLike = (cardId) => {
  if (typeof cardId !== 'string' || !cardId.trim()) {
    console.error('Некорректный идентификатор карточки:', cardId);
    return Promise.reject('Некорректный идентификатор карточки.');
  }
  return fetch(`${apiSettings.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: apiSettings.headers,
  }).then(checkServerResponse);
};

export const removeLike = (cardId) => {
  if (typeof cardId !== 'string' || !cardId.trim()) {
    console.error('Некорректный идентификатор карточки:', cardId);
    return Promise.reject('Некорректный идентификатор карточки.');
  }
  return fetch(`${apiSettings.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: apiSettings.headers,
  }).then(checkServerResponse);
};

// Обновляем аватар
export const changeAvatar = (avatarUrl) => {
  return fetch(`${apiSettings.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: apiSettings.headers,
    body: JSON.stringify({avatar: avatarUrl}),
  }).then(checkServerResponse);
};
