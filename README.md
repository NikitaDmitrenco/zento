# Zento — Современный интернет-магазин цифровой техники

> **Основная цель проекта:** Помочь клиенту быстро, легко и точно найти нужную технику по его персональному запросу и оформить заказ в несколько кликов.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://zento-blue.vercel.app)
[![Live Demo](https://img.shields.io/badge/Live_Demo-zento--blue.vercel.app-blue?logo=googlechrome)](https://zento-blue.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=postgresql)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-34_Passed-6E9F18?logo=vitest)](https://vitest.dev/)
[![DeepSeek AI](https://img.shields.io/badge/AI_Assistant-DeepSeek-blueviolet)](https://platform.deepseek.com/)

---

## 🌐 Где посмотреть и протестировать (Live Demo)

Проект полностью собран, развернут на **Vercel** и подключен к облачной базе данных **Supabase PostgreSQL**:

* 🛒 **Витрина магазина (Production):** [https://zento-blue.vercel.app](https://zento-blue.vercel.app)
  * 🇷🇺 Русский язык: [https://zento-blue.vercel.app/ru](https://zento-blue.vercel.app/ru)
  * 🇬🇧 English: [https://zento-blue.vercel.app/en](https://zento-blue.vercel.app/en)
  * 🇲🇩 Română: [https://zento-blue.vercel.app/ro](https://zento-blue.vercel.app/ro)
* ⚙️ **Панель Администратора:** [https://zento-blue.vercel.app/admin](https://zento-blue.vercel.app/admin)

### 🔑 Данные для входа и тестирования:

| Роль | Email | Пароль | Доступные возможности |
| :--- | :--- | :--- | :--- |
| **👑 Администратор** | `admin@zento.tech` | `admin123` | Доступ к админке `/admin`, управление товарами, отслеживание заказов, список пользователей |
| **👤 Покупатель** | `user@zento.tech` | `user123` | Поиск товаров, корзина, оформление заказов, диалог с AI |

---

## 🚀 Основной функционал

### 1. Пользовательская часть (Storefront)
- 🔍 **Умный поиск и фильтрация**: Мгновенный поиск по названиям, описаниям и популярным брендам (**Apple, Samsung, Xiaomi, Sony, ASUS, Google, Lenovo, Bose, Garmin, Anker**). Фильтры по категориям, ценам и наличию без перезагрузки страниц.
- 📱 **Каталог и карточки товаров**: Полноразмерные качественные фотографии на белом фоне, подробные матрицы технических характеристик, бейджи топ-товаров.
- 🛒 **Корзина и расчет**: Быстрое добавление товаров, динамический пересчет количества и стоимости.
- 💳 **Оформление заказа (Чекаут)**:
  - Выбор способа оплаты: *«При получении (Курьеру)»* или *«Банковской картой онлайн»*.
  - Интерактивная виртуальная банковская карта с валидацией номера, срока действия, CVC и симуляцией 3D-Secure 2.0.
  - Экран успешного заказа с уникальным номером и статусом.
- 🌐 **Мультиязычность**: Полная локализация на 3 языка (**RU / EN / RO**) на уровне маршрутов (`/ru`, `/en`, `/ro`) без потери производительности.
- 🔐 **Авторизация и профиль**: Регистрация и вход с безопасными JWT-токенами в `httpOnly` cookies и bcrypt-хешированием паролей.

### 2. Панель управления (Admin Panel)
- 📊 **Дашборд метрик**: Количество активных товаров, заказов и зарегистрированных клиентов.
- 📦 **Управление заказами**: Мониторинг поступающих заказов со статусами: `Ожидает` → `Оплачен/Подтвержден` → `В обработке` → `Отгружен` → `Завершен`.
- ➕ **Добавление товаров**: Создание новых позиций с автогенерацией URL-слагов, выбором брендов, категорий и гибкой таблицей характеристик.
- 👥 **Список пользователей**: Контроль зарегистрированных аккаунтов и их ролей (`USER` / `ADMIN`).
- 🛡️ **Edge Middleware защита**: Доступ к разделу `/admin` закрыт на уровне CDN-шлюза для неавторизованных пользователей.

### 3. Встроенный AI-ассистент
- ✨ **Умный консультант в правом нижнем углу**:
  - Работает на базе нейросети **DeepSeek** (`deepseek-chat`).
  - Знает весь ассортимент магазина, цены в MDL и точные характеристики.
  - Помогает подобрать технику под бюджет и задачи (*«Посоветуй легкий ноутбук для работы»*, *«Наушники с лучшим шумоподавлением»*).
  - Выводит **интерактивные карточки рекомендуемых товаров** с фото и кнопкой прямого перехода прямо внутри чата.
  - Грамотно и спокойно отвечает на сервисные вопросы (почему у магазина нет физ. адреса и как работает курьерская доставка).
  - Работает на всех 3 языках магазина и имеет автономный режим (fallback).

---

## 🛠️ Технический стек и архитектура

Проект спроектирован по стандарту **модульного монолита** с акцентом на скорость, масштабируемость и строгую финансовую безопасность:

```
┌─────────────────────────────────────────────────────────────┐
│                    ZENTO ARCHITECTURE                       │
├──────────────────────────────┬──────────────────────────────┤
│ Frontend & Rendering         │ Next.js 16 App Router,       │
│                              │ React 19, Turbopack, SSR     │
├──────────────────────────────┼──────────────────────────────┤
│ Styling & Design System      │ Tailwind CSS v4,             │
│                              │ Modern Clean UI              │
├──────────────────────────────┼──────────────────────────────┤
│ Language & Typing            │ TypeScript (100% Strict)     │
├──────────────────────────────┼──────────────────────────────┤
│ Database & ORM               │ PostgreSQL (Supabase Cloud), │
│                              │ Drizzle ORM                  │
├──────────────────────────────┼──────────────────────────────┤
│ Artificial Intelligence      │ DeepSeek API + Smart Logic   │
├──────────────────────────────┼──────────────────────────────┤
│ Auth & Security              │ Stateless JWT (jose HS256),  │
│                              │ bcryptjs, Edge Middleware    │
├──────────────────────────────┼──────────────────────────────┤
│ Quality & Testing            │ Vitest (34 теста), ESLint,   │
│                              │ Playwright E2E               │
└──────────────────────────────┴──────────────────────────────┘
```

* **Безопасность цен**: Все финансовые вычисления (цены, скидки, суммы заказов) хранятся и пересчитываются на сервере в минимальных единицах (центы/бани), исключая ошибки округления и подмену цен на клиенте.
* **Serverless готовность**: Архитектура адаптирована для мгновенного масштабирования на Vercel, AWS или собственных VPS-серверах (Docker / Ubuntu).

---

## 💻 Как клонировать и запустить проект своими руками

Вы можете развернуть и протестировать проект локально через командную строку (CMD / PowerShell / Terminal).

### Шаг 1. Клонировать репозиторий с GitHub
```bash
git clone https://github.com/NikitaDmitrenco/zento.git
cd zento
```

### Шаг 2. Установить зависимости
```bash
npm install
```

### Шаг 3. Настроить переменные окружения
Создайте файл `.env.local` в корневой папке проекта:
```env
# Подключение к базе данных (Supabase PostgreSQL или локальный Postgres)
DATABASE_URL="postgresql://postgres.syvocricidabqykwdngh:L3sufTEPM6yRHcyn@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Секретный ключ для авторизации JWT (любая случайная строка от 32 символов)
AUTH_SECRET="supersecret_production_auth_key_zento_2024_secure"
AUTH_URL="http://localhost:3000"

# Ключ DeepSeek API (опционально, есть встроенный автономный режим)
DEEPSEEK_API_KEY=""
```

### Шаг 4. Наполнить базу данных товарами (Сид)
```bash
# Применить схему таблиц
npm run db:push

# Заполнить базу категориями, брендами и 20 реальными товарами
npm run db:seed
```

### Шаг 5. Запустить сервер разработки
```bash
npm run dev
```

Откройте в браузере: **[http://localhost:3000/ru](http://localhost:3000/ru)**

---

## 🧪 Запуск автоматических тестов

В проекте настроен полный набор автотестов, покрывающих базу данных, поиск, корзину, оформление заказов, безопасность и AI-ассистента:

```bash
# Запуск всех 34 автотестов (Vitest)
npm run test

# Проверка строгой типизации TypeScript
npm run typecheck

# Проверка качества кода линтером
npm run lint

# Сборка готового продакшн-бандла
npm run build
```

---

## 📁 Структура проекта

```
zento/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/             # Мультиязычные страницы витрины (/, /catalog, /product, /cart, /checkout)
│   │   ├── admin/                # Защищенная панель администратора (/admin/orders, /admin/products, /admin/users)
│   │   └── api/                  # Серверные API-эндпоинты (/api/ai/chat, /api/auth/*, /api/orders/*)
│   ├── components/               # Модульные React-компоненты
│   │   ├── ai/                   # Интерактивный виджет AI-ассистента
│   │   ├── catalog/              # Карточки товаров, фильтры, поисковая панель
│   │   ├── checkout/             # Форма чекаута с виртуальной банковской картой
│   │   └── ui/                   # Базовые UI-элементы (кнопки, инпуты, бейджи, иконки)
│   ├── db/                       # Слой базы данных
│   │   ├── schema.ts             # Drizzle PostgreSQL схема
│   │   ├── seed.ts               # Скрипт наполнения базы
│   │   └── data/                 # Реальный каталог техники, категорий и брендов
│   ├── i18n/                     # Модуль локализации (словари ru.json, en.json, ro.json)
│   ├── lib/                      # Утилиты авторизации (JWT, сессии, cookies)
│   ├── services/                 # Бизнес-логика (AI сервис, каталог, заказы, корзина, auth)
│   └── middleware.ts             # Edge Middleware для защиты админки
├── tests/                        # Набор 34 модульных и интеграционных тестов
├── public/                       # Статические файлы, логотипы брендов и фотографии товаров
├── README.md                     # Документация проекта
└── package.json                  # Зависимости и npm-скрипты
```

---

### 👨‍💻 Автор проекта
**Nikita Dmitrenco**  
GitHub: [@NikitaDmitrenco](https://github.com/NikitaDmitrenco)  
Репозиторий: [https://github.com/NikitaDmitrenco/zento](https://github.com/NikitaDmitrenco/zento)
