# zento. — Modern E-Commerce Platform for Digital Tech

![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)
![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?logo=tailwindcss)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?logo=drizzle)
![Supabase PostgreSQL](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)
![Vitest](https://img.shields.io/badge/Vitest-31_Passed-6E9F18?logo=vitest)

**Zento** — это современный, масштабируемый интернет-магазин цифровой техники и электроники, построенный по архитектуре **модульного монолита** на Next.js 16 (App Router), React 19, Tailwind CSS v4, Drizzle ORM и облачной базе данных Supabase PostgreSQL.

---

## 🌟 Ключевые возможности проекта

- ⚡ **Высочайшая производительность**: Серверный рендеринг (SSR), мгновенная сборка с Next.js Turbopack и кэширование статических страниц.
- 🌐 **Полноценная локализация (i18n)**: Поддержка 3 языков (**Русский `/ru`**, **Английский `/en`**, **Румынский `/ro`**) с динамическим переключением в шапке сайта.
- 🛍️ **Интерактивный Каталог товаров**: Поиск по названию/описанию, фильтрация по категориям и брендам, сортировка по цене (по возрастанию/убыванию) и пагинация.
- 📱 **Карточка товара**: Галерея изображений, выбор количества, статус наличия на складе, гарантии и группированная таблица технических характеристик.
- 🛒 **Корзина покупателя**: Локальное сохранение состава заказа, проверка остатков на складе и автоматический расчет итоговой суммы.
- 💳 **Форма оформления заказа**: Валидация полей через Zod, строгая маска ввода номера телефона, фиксация снимков цен на момент покупки и страница успешного оформления.
- 🛡️ **Юридическое соответствие законам РМ**:
  - **Политика конфиденциальности (`/privacy`)**: Разработана в соответствии с Законом РМ № 133/2011 о защите персональных данных и Регламентом от 23 августа о хранении и уничтожении данных.
  - **Условия обслуживания (`/terms`)**: Разработана в соответствии с Законом РМ № 105/2003 о защите прав потребителей и Законом № 284/2004 об электронной коммерции.
- ⚙️ **Защищенная Панель Администратора (`/admin`)**:
  - **Дашборд**: Метрики продаж, количество товаров, заказов и пользователей.
  - **Управление каталогом товаров**: Просмотр цен и складских остатков.
  - **Форма создания товара (`/admin/products/new`)**: Указание производителя/бренда над названием, категории, цены, описания и загрузка изображения с компьютера с предпросмотром.
  - **Отслеживание заказов**: Отслеживание поступающих заказов в реальном времени с выводом уникального номера `ORD-XXXXXX`, контактов, адреса доставки и смены статусов.
  - **Реестр пользователей**: Просмотр зарегистрированных покупателей и администраторов.
- 🔑 **Система Авторизации и Безопасности**: Хеширование паролей `bcryptjs`, сессионные HTTP-only cookies на базе JWT (`jose`), распределение ролей (`USER` / `ADMIN`).

---

## 🛠️ Технологический стек

| Слой | Технология |
| :--- | :--- |
| **Фреймворк** | Next.js 16.3 (App Router, Turbopack) |
| **Библиотека UI** | React 19, Vanilla CSS3, Tailwind CSS v4 |
| **Язык** | TypeScript 5 (строгий режим `noImplicitAny`) |
| **База данных** | Supabase PostgreSQL 24/7 Cloud |
| **ORM** | Drizzle ORM & Drizzle Kit |
| **Авторизация** | Custom Auth.js (JWT HTTP-only cookies, bcryptjs) |
| **Валидация** | Zod schema validation |
| **Тестирование** | Vitest (29 автоматических юнит-тестов) |
| **Деплой** | Vercel Serverless Platform |

---

## 🔑 Учётные записи для тестирования

Для проверки работы системы доступны 2 преднастроенных аккаунта:

### 👑 1. Администратор (`ADMIN`)
- **Email**: `admin@zento.tech`
- **Пароль**: `admin123`
- **Возможности**: Доступ к магазину + полный доступ к Панели управления **`/admin`** и кнопка `🛡️ Админка` в шапке.

### 👤 2. Покупатель (`USER`)
- **Email**: `user@zento.tech`
- **Пароль**: `user123`
- **Имя**: Сергей Новиков
- **Возможности**: Обычные покупки, каталог, корзина и оформление заказов.

---

## 🚀 Быстрый старт (Локальный запуск)

### 1. Клонирование репозитория
```bash
git clone https://github.com/NikitaDmitrenco/zento.git
cd zento
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env.local` в корне проекта:
```env
DATABASE_URL="postgresql://postgres.syvocricidabqykwdngh:L3sufTEPM6yRHcyn@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
AUTH_SECRET="zento-super-secret-key-2026-production-jwt-token"
AUTH_URL="http://localhost:3000"
```

### 4. Накат схемы и наполнение базы данных
```bash
npm run db:push
npm run db:seed
```

### 5. Запуск локального сервера разработки
```bash
npm run dev
```
Откройте браузер по адресу **[http://localhost:3000/ru](http://localhost:3000/ru)**.

---

## 🧪 Тестирование и Качество Кода

В проекте настроено автоматическое тестирование через Vitest и статическая проверка типов:

```bash
# Проверка типов TypeScript
npm run typecheck

# Линтинг ESLint
npm run lint

# Запуск 29 юнит-тестов Vitest
npm run test

# Проверка производственной сборки
npm run build
```

---

## 📂 Структура проекта

```text
zento/
├── src/
│   ├── app/                    # Next.js App Router (локализованные и админ-маршруты)
│   │   ├── [locale]/           # Публичные страницы (/ru, /en, /ro)
│   │   │   ├── auth/           # Вход и Регистрация (/auth/login, /auth/register)
│   │   │   ├── catalog/        # Каталог товаров с фильтрами
│   │   │   ├── product/[slug]/ # Страница конкретного товара
│   │   │   ├── cart/           # Корзина
│   │   │   ├── checkout/       # Оформление заказа и страница успеха
│   │   │   ├── privacy/        # Политика конфиденциальности (Законы РМ)
│   │   │   └── terms/          # Условия обслуживания (Законы РМ)
│   │   ├── admin/              # Панель администратора (/admin, /admin/products, /admin/orders, /admin/users)
│   │   └── api/                # API роуты (/api/auth/*, /api/orders/*, /api/products/*)
│   ├── components/             # Reusable UI Компоненты (Header, Footer, ProductCard, Input, Button и т.д.)
│   ├── db/                     # Drizzle ORM схема, подсоединение и сиды (schema.ts, seed.ts, data/)
│   ├── i18n/                   # Конфигурация локалей и словари переводов (ru.json, en.json, ro.json)
│   ├── lib/                    # Утилиты авторизации и работы с сессиями
│   └── services/               # Бизнес-логика (Auth, Catalog, Cart, Orders)
├── tests/                      # Набор из 10 тестовых суитов Vitest
├── PROJECT_STATUS.md           # Документ отслеживания этапов разработки
└── drizzle.config.ts           # Конфигурация миграций Drizzle ORM
```

---

## 📄 Лицензия & Авторство

Проект разработан **Nikita Dmitrenco** в рамках серии этапов Master Prompt для Zento E-Commerce.

- **GitHub Repository**: [https://github.com/NikitaDmitrenco/zento](https://github.com/NikitaDmitrenco/zento)
