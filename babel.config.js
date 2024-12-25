const presets = [
  ['@babel/preset-env', { // Указываем, какой пресет Babel использовать
    targets: { // Определяем, какие версии браузеров нужно поддерживать
      edge: '17', // Microsoft Edge версии 17 и выше
      ie: '11', // Internet Explorer версии 11
      firefox: '50', // Mozilla Firefox версии 50 и выше
      chrome: '64', // Google Chrome версии 64 и выше
      safari: '11.1' // Safari версии 11.1 и выше
    },

    // Включаем полифилы для обеспечения поддержки указанных браузеров
    // Babel автоматически подключит нужные полифилы из библиотеки core-js
    useBuiltIns: "entry" // Подключаем полифилы в точке входа (например, из index.js)
  }]
];

// Экспортируем настройки для использования в конфигурации Babel
module.exports = { presets };
