const fs = require('fs');
const p = 'index.html';
let s = fs.readFileSync(p, 'utf8');
const caps = [
  'Талант студии', 'Процесс работы', 'Деталь работы', 'Индивидуальный эскиз',
  'Микро-детализация', 'Студия в работе', 'Мини-тату', 'Крупный проект',
  'Классический сюжет', 'Тонкие линии', 'Пирсинг &amp; украшения', 'Cover-Up · результат'
];
let i = 0;
s = s.replace(/data-cap="[^"]*"/g, () => 'data-cap="' + caps[i++] + '"');
fs.writeFileSync(p, s);
console.log('captions updated:', i);