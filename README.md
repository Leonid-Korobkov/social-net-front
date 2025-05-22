# Zling — Cоциальная сеть (Frontend)

_Connect, Share, and Engage Like Never Before_

![last-commit](https://img.shields.io/github/last-commit/Leonid-Korobkov/social-net-front?style=flat&logo=git&logoColor=white&color=0080ff)
![repo-top-language](https://img.shields.io/github/languages/top/Leonid-Korobkov/social-net-front?style=flat&color=0080ff)
![repo-language-count](https://img.shields.io/github/languages/count/Leonid-Korobkov/social-net-front?style=flat&color=0080ff)

---

## Используемые технологии

![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000.svg?style=flat&logo=Next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000.svg?style=flat&logo=Zustand&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990.svg?style=flat&logo=React-Hook-Form&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=flat&logo=Tailwind-CSS&logoColor=white)
![HeroUI](https://img.shields.io/badge/HeroUI-6366F1.svg?style=flat&logo=heroicons&logoColor=white)
![React Icons](https://img.shields.io/badge/React%20Icons-61DAFB.svg?style=flat&logo=React&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-770C56.svg?style=flat&logo=date-fns&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF.svg?style=flat&logo=Framer&logoColor=white)
![Tiptap](https://img.shields.io/badge/Tiptap-6A4CFF.svg?style=flat)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5.svg?style=flat&logo=Cloudinary&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-FF4154.svg?style=flat&logo=React-Query&logoColor=white)
![React Virtual](https://img.shields.io/badge/React%20Virtual-FF4154.svg?style=flat)
![React Dropzone](https://img.shields.io/badge/React%20Dropzone-0088FE.svg?style=flat)
![React Hot Toast](https://img.shields.io/badge/React%20Hot%20Toast-FFFAE3.svg?style=flat)
![clsx](https://img.shields.io/badge/clsx-000000.svg?style=flat)
![js-cookie](https://img.shields.io/badge/js--cookie-3C3C3C.svg?style=flat)
![jwt-decode](https://img.shields.io/badge/jwt--decode-000000.svg?style=flat)
![html-react-parser](https://img.shields.io/badge/html--react--parser-000000.svg?style=flat)
![tippy.js](https://img.shields.io/badge/tippy.js-4E9EEA.svg?style=flat)
![lowlight](https://img.shields.io/badge/lowlight-000000.svg?style=flat)
![heic2any](https://img.shields.io/badge/heic2any-000000.svg?style=flat)
![postcss](https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat&logo=Autoprefixer&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white)

---

## О проекте

**Zling** — современная социальная сеть, где пользователи могут делиться постами, комментировать, ставить лайки, подписываться друг на друга и персонализировать свои профили. Проект построен на стеке React, Next.js, TypeScript, Tailwind CSS и других современных технологиях.

---

## Функционал

- **Аутентификация и регистрация**

  - Регистрация с валидацией (имя, email, пароль).
  - Вход по email и паролю.
  - Для новых пользователей автоматически генерируется аватар.
  - Безопасное хранение токенов, защита приватных маршрутов.
- **Посты**

  - Лента постов с автором, аватаром, датой, лайками и комментариями.
  - Создание, редактирование и удаление своих постов (с подтверждением).
  - Загрузка изображений (оптимизация, предпросмотр).
  - Реализация лайков и мгновенное обновление счетчиков.
- **Комментарии**

  - Просмотр и добавление комментариев к посту.
  - Мгновенное обновление комментариев.
- **Профиль пользователя**

  - Просмотр и редактирование профиля (имя, email, дата рождения, аватар, биография, местоположение).
  - Количество подписчиков и подписок.
  - Возможность подписаться/отписаться от других пользователей.
- **Подписки и подписчики**

  - Страницы со списком подписчиков и подписок.
  - Быстрый переход на профиль любого пользователя.
- **Поиск**

  - Поиск пользователей и постов.
- **Адаптивный дизайн**

  - Полная поддержка мобильных и десктопных устройств.
  - Современный UI с использованием Tailwind CSS и HeroUI.
- **Обработка ошибок**

  - Глобальная страница ошибок с информативными сообщениями.

---

## Страницы приложения

- `/auth` — регистрация и вход
- `/posts` — лента постов
- `/posts/[id]` — просмотр отдельного поста с комментариями
- `/create-post` — создание поста
- `/users/[id]` — профиль пользователя
- `/users/[id]/followers` — подписчики
- `/users/[id]/following` — подписки
- `/search` — поиск пользователей/постов
- `/error` — страница ошибок

---

## Используемые технологии

Вот подробное описание всех основных технологий, используемых в проекте, с кратким пояснением для каждой:

- **React 19** — современная библиотека для построения пользовательских интерфейсов на основе компонентного подхода.
- **Next.js 15** — фреймворк для React, предоставляющий SSR/SSG, маршрутизацию, оптимизацию и удобную структуру для масштабируемых приложений.
- **TypeScript** — надстройка над JavaScript с поддержкой статической типизации, что повышает надёжность и читаемость кода.
- **Zustand** — легковесная альтернатива Redux для локального и глобального состояния, удобна для небольших и средних фич.
- **React Hook Form** — библиотека для работы с формами и валидацией, минимизирует количество ререндеров и упрощает интеграцию с UI.
- **Tailwind CSS** — утилитарный CSS-фреймворк для быстрой и адаптивной стилизации интерфейса.
- **HeroUI** — набор готовых UI-компонентов для React, основанных на Tailwind CSS, ускоряет разработку и обеспечивает единый стиль.
- **React Icons** — коллекция популярных SVG-иконок для React-приложений.
- **Axios** — HTTP-клиент для выполнения запросов к backend API, поддерживает перехватчики, отмену запросов и др.
- **date-fns** — современная библиотека для работы с датами и временем, альтернатива moment.js.
- **Framer Motion** — библиотека для создания плавных и современных анимаций в React.
- **Tiptap** — мощный rich-text редактор на базе ProseMirror, используется для создания и редактирования постов с форматированием.
- **Cloudinary** (или аналог) — облачный сервис для загрузки, хранения и оптимизации изображений (используется для хранения медиафайлов пользователей).
- **@tanstack/react-query** — библиотека для асинхронного получения, кэширования и синхронизации данных с сервером.
- **@tanstack/react-virtual** — инструмент для виртуализации длинных списков, повышает производительность при рендере больших коллекций.
- **React Dropzone** — компонент для drag-and-drop загрузки файлов (например, изображений к постам).
- **React Hot Toast** — библиотека для отображения всплывающих уведомлений (toast) с минималистичным дизайном.
- **clsx** — утилита для условного объединения CSS-классов.
- **js-cookie** — удобная работа с cookie в браузере (например, для хранения токенов).
- **jwt-decode** — декодирование JWT-токенов на клиенте.
- **html-react-parser** — безопасный парсер HTML-строк в React-элементы.
- **tippy.js** — библиотека для создания всплывающих подсказок (tooltip).
- **lowlight** — подсветка синтаксиса для редактора кода.
- **heic2any** — конвертация изображений HEIC в другие форматы (например, для поддержки загрузки с iPhone).
- **PostCSS** — инструмент для трансформации CSS с помощью плагинов.
- **Autoprefixer** — плагин для PostCSS, автоматически добавляет вендорные префиксы в CSS.
- **ESLint** — инструмент для анализа и автоматического исправления проблем в коде (линтер).

---

## Быстрый старт

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/Leonid-Korobkov/social-net-front.git
   cd social-net-front
   ```
2. **Установите зависимости:**

   ```bash
   npm install
   ```
3. **Настройте переменные окружения:**
   Создайте файл `.env` в корне и добавьте необходимые переменные (см. пример в `.env.example` или документации backend).
4. **Запустите сервер разработки:**

   ```bash
   npm run dev
   ```

   Приложение будет доступно по адресу [http://localhost:4000](http://localhost:4000) (или другому, если указан в env).

---

## Сборка и деплой

- **Сборка:**
  ```bash
  npm run build
  ```
- **Запуск production-сервера:**
  ```bash
  npm start
  ```
- **Деплой:**
  Пример деплоя реализован через [Railway](https://railway.app/) и Caddy (см. `Caddyfile`).

---

## Вклад в проект

Pull requests приветствуются! Сделайте форк, создайте ветку с изменениями и отправьте PR.

---

## Благодарности

- [NextUI](https://nextui.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Railway](https://railway.app/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Hook Form](https://react-hook-form.com/)
- [Tiptap](https://tiptap.dev/)

---

## Backend

Для backend-части проекта: [social-net-back](https://github.com/Leonid-Korobkov/social-net-back)

---

## Демо

[https://zling.vercel.app/](https://zling.vercel.app/)

---
