export const demoCategories = [
  {
    name: "Smartphones",
    slug: "smartphones",
    description: "Флагманские смартфоны Apple, Samsung, Google и Xiaomi последнего поколения.",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "Профессиональные ноутбуки и ультрабуки Apple MacBook, ASUS ROG и Lenovo ThinkPad.",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "Производительные планшеты Apple iPad Pro, iPad Air и Samsung Galaxy Tab S10.",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Headphones",
    slug: "headphones",
    description: "Премиальные полноразмерные и TWS наушники Sony, Apple AirPods и Bose.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Smart Watches",
    slug: "smart-watches",
    description: "Умные часы Apple Watch Series 10, Samsung Galaxy Watch 7 и Garmin Fenix 8.",
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Оригинальные сетевые зарядные устройства, аккумуляторы Anker и док-станции.",
    imageUrl: "https://images.unsplash.com/photo-1609592424074-2ef5336bf7b1?w=800&auto=format&fit=crop&q=80",
  },
];

export const demoBrands = [
  { name: "Apple", slug: "apple", logoUrl: "brands/apple.webp" },
  { name: "Samsung", slug: "samsung", logoUrl: "brands/samsung.webp" },
  { name: "Sony", slug: "sony", logoUrl: "brands/sony.webp" },
  { name: "ASUS", slug: "asus", logoUrl: "brands/asus.webp" },
  { name: "Xiaomi", slug: "xiaomi", logoUrl: "brands/xiaomi.webp" },
  { name: "Bose", slug: "bose", logoUrl: "brands/bose.webp" },
  { name: "Garmin", slug: "garmin", logoUrl: "brands/garmin.webp" },
  { name: "Anker", slug: "anker", logoUrl: "brands/anker.webp" },
  { name: "Google", slug: "google", logoUrl: "brands/google.webp" },
  { name: "Lenovo", slug: "lenovo", logoUrl: "brands/lenovo.webp" },
];

export const demoUsers = [
  {
    name: "Администратор Zento",
    email: "admin@zento.tech",
    password: "admin123",
    role: "ADMIN" as const,
  },
  {
    name: "Сергей Новиков",
    email: "user@zento.tech",
    password: "user123",
    role: "USER" as const,
  },
];

export const demoProducts = [
  // Smartphones (4)
  {
    name: "Apple iPhone 16 Pro Max (2024)",
    slug: "apple-iphone-16-pro-max-2024",
    description: "Флагманский смартфон 2024 года с дисплеем Super Retina XDR 6.9 дюйма, чипом A18 Pro, титановым корпусом и кнопкой управления камерой Camera Control.",
    price: 2799900, // 27,999 MDL / 2799900 cents
    stock: 15,
    isFeatured: true,
    categorySlug: "smartphones",
    brandSlug: "apple",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Дисплей", name: "Экран", value: "6.9\" Super Retina XDR OLED 120Hz ProMotion" },
      { groupName: "Процессор", name: "Чипсет", value: "Apple A18 Pro (3nm)" },
      { groupName: "Память", name: "Накопитель", value: "256 GB NVMe" },
      { groupName: "Камера", name: "Основная камера", value: "48 MP Main + 48 MP Ultra-Wide + 12 MP 5x Telephoto" },
    ],
  },
  {
    name: "Samsung Galaxy S24 Ultra (2024)",
    slug: "samsung-galaxy-s24-ultra-2024",
    description: "Премиальный смартфон с 6.8-дюймовым экраном Dynamic AMOLED 2X 120Гц, титановым рамкой, процессором Snapdragon 8 Gen 3, пером S Pen и искусственным интеллектом Galaxy AI.",
    price: 2499900, // 24,999 MDL
    stock: 20,
    isFeatured: true,
    categorySlug: "smartphones",
    brandSlug: "samsung",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Дисплей", name: "Экран", value: "6.8\" Dynamic AMOLED 2X 120Hz QHD+" },
      { groupName: "Процессор", name: "Чипсет", value: "Snapdragon 8 Gen 3 for Galaxy" },
      { groupName: "Камера", name: "Модули", value: "200 MP + 50 MP + 12 MP + 10 MP" },
      { groupName: "Батарея", name: "Емкость", value: "5000 mAh 45W Fast Charging" },
    ],
  },
  {
    name: "Google Pixel 9 Pro (2024)",
    slug: "google-pixel-9-pro-2024",
    description: "Флагман от Google с нейропроцессором Tensor G4, встроенным ИИ Gemini Advanced, матовым стеклом и передовой системой мобильной фотографии.",
    price: 1999900, // 19,999 MDL
    stock: 12,
    isFeatured: false,
    categorySlug: "smartphones",
    brandSlug: "google",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Дисплей", name: "Экран", value: "6.3\" Super Actua LTPO OLED 120Hz" },
      { groupName: "Процессор", name: "Чипсет", value: "Google Tensor G4" },
      { groupName: "Память", name: "ОЗУ / Память", value: "16 GB RAM / 256 GB" },
    ],
  },
  {
    name: "Xiaomi 14 Ultra (2024)",
    slug: "xiaomi-14-ultra-2024",
    description: "Фотофлагман с 1-дюймовым сенсором Sony LYT-900, оптикой Leica Summilux, переменной диафрагмой f/1.63–f/4.0 и ультрабыстрой зарядкой 90Вт.",
    price: 2299900, // 22,999 MDL
    stock: 10,
    isFeatured: false,
    categorySlug: "smartphones",
    brandSlug: "xiaomi",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Камера", name: "Оптика", value: "Leica Quad Camera System (50MP x4)" },
      { groupName: "Процессор", name: "Чипсет", value: "Snapdragon 8 Gen 3" },
      { groupName: "Дисплей", name: "Матрица", value: "6.73\" WQHD+ AMOLED 120Hz" },
    ],
  },

  // Laptops (4)
  {
    name: "Apple MacBook Pro 16 M3 Max (2024)",
    slug: "apple-macbook-pro-16-m3-max",
    description: "Мощнейшая мобильная станция в цвете Space Black на чипе M3 Max (16 ядер CPU, 40 ядер GPU), 48GB объединенной памяти и дисплеем Liquid Retina XDR.",
    price: 4999900, // 49,999 MDL
    stock: 8,
    isFeatured: true,
    categorySlug: "laptops",
    brandSlug: "apple",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Процессор", name: "Чипсет", value: "Apple M3 Max (16 CPU / 40 GPU cores)" },
      { groupName: "Память", name: "ОЗУ / Накопитель", value: "48 GB Unified RAM / 1 TB SSD" },
      { groupName: "Дисплей", name: "Экран", value: "16.2\" Liquid Retina XDR (3456x2234) 120Hz" },
    ],
  },
  {
    name: "Apple MacBook Air 15 M3 (2024)",
    slug: "apple-macbook-air-15-m3-2024",
    description: "Ультратонкий 15-дюймовый ноутбук в алюминиевом корпусе на чипе M3 с пассивным бесшумным охлаждением и до 18 часов автономной работы.",
    price: 2599900, // 25,999 MDL
    stock: 25,
    isFeatured: false,
    categorySlug: "laptops",
    brandSlug: "apple",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Процессор", name: "Чипсет", value: "Apple M3 (8 CPU / 10 GPU)" },
      { groupName: "Память", name: "ОЗУ / Накопитель", value: "16 GB RAM / 512 GB SSD" },
      { groupName: "Дисплей", name: "Экран", value: "15.3\" Liquid Retina 500 nits" },
    ],
  },
  {
    name: "ASUS ROG Zephyrus G16 (2024)",
    slug: "asus-rog-zephyrus-g16-2024",
    description: "Игровой ноутбук премиум-класса с 16-дюймовым ROG Nebula OLED экраном 240Гц, процессором Intel Core Ultra 9 185H и графикой NVIDIA RTX 4080.",
    price: 4299900, // 42,999 MDL
    stock: 6,
    isFeatured: true,
    categorySlug: "laptops",
    brandSlug: "asus",
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Процессор", name: "CPU", value: "Intel Core Ultra 9 185H" },
      { groupName: "Видеокарта", name: "GPU", value: "NVIDIA GeForce RTX 4080 12GB" },
      { groupName: "Дисплей", name: "Экран", value: "16\" 2.5K OLED 240Hz 0.2ms" },
    ],
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 12 (2024)",
    slug: "lenovo-thinkpad-x1-carbon-gen12",
    description: "Бизнес-ультрабук из углеродного волокна весом 1.09 кг с процессором Intel Core Ultra 7, 32GB RAM, сенсорным OLED-дисплеем и сканером отпечатков.",
    price: 3799900, // 37,999 MDL
    stock: 14,
    isFeatured: false,
    categorySlug: "laptops",
    brandSlug: "lenovo",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Корпус", name: "Материал / Вес", value: "Carbon Fiber & Magnesium Chassis (1.09 kg)" },
      { groupName: "Процессор", name: "CPU", value: "Intel Core Ultra 7 155H" },
      { groupName: "Память", name: "ОЗУ / Накопитель", value: "32 GB LPDDR5x / 1 TB SSD" },
    ],
  },

  // Tablets (3)
  {
    name: "Apple iPad Pro 13 M4 (2024)",
    slug: "apple-ipad-pro-13-m4-2024",
    description: "Самый тонкий продукт Apple за всю историю (5.1 мм). Двухслойный Ultra Retina XDR OLED дисплей, чип M4 и поддержка стилуса Apple Pencil Pro.",
    price: 2699900, // 26,999 MDL
    stock: 15,
    isFeatured: true,
    categorySlug: "tablets",
    brandSlug: "apple",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Дисплей", name: "Матрица", value: "13\" Tandem OLED Ultra Retina XDR 120Hz" },
      { groupName: "Процессор", name: "Чипсет", value: "Apple M4 (9 CPU / 10 GPU cores)" },
      { groupName: "Память", name: "Накопитель", value: "256 GB NVMe" },
    ],
  },
  {
    name: "Samsung Galaxy Tab S10 Ultra (2024)",
    slug: "samsung-galaxy-tab-s10-ultra",
    description: "Огромный 14.6-дюймовый планшет с экраном Dynamic AMOLED 2X, антибликовым покрытием, защитой IP68 от воды и фирменным стилусом S Pen.",
    price: 2399900, // 23,999 MDL
    stock: 18,
    isFeatured: false,
    categorySlug: "tablets",
    brandSlug: "samsung",
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Дисплей", name: "Экран", value: "14.6\" Dynamic AMOLED 2X 120Hz Anti-Reflection" },
      { groupName: "Защита", name: "Стандарт", value: "IP68 Dust & Water Resistance" },
      { groupName: "Комплект", name: "Перо", value: "S Pen Included" },
    ],
  },
  {
    name: "Apple iPad Air 11 M2 (2024)",
    slug: "apple-ipad-air-11-m2-2024",
    description: "Универсальный планшет с дисплеем Liquid Retina 11 дюймов, чипом M2, фронтальной камерой на длинной грани и стереодинамиками.",
    price: 1399900, // 13,999 MDL
    stock: 30,
    isFeatured: false,
    categorySlug: "tablets",
    brandSlug: "apple",
    images: [
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Дисплей", name: "Экран", value: "11\" Liquid Retina True Tone" },
      { groupName: "Процессор", name: "Чипсет", value: "Apple M2" },
      { groupName: "Память", name: "Накопитель", value: "128 GB" },
    ],
  },

  // Headphones (3)
  {
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description: "Флагманские полноразмерные наушники с активным шумоподавлением (2 процессора, 8 микрофонов), 30 часами работы и кодеком LDAC Hi-Res Audio.",
    price: 749900, // 7,499 MDL
    stock: 35,
    isFeatured: true,
    categorySlug: "headphones",
    brandSlug: "sony",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Шумоподавление", name: "Система", value: "Dual Processors V1 + QN1 ANC" },
      { groupName: "Батарея", name: "Автономность", value: "30 Hours Playback with Quick Charge" },
      { groupName: "Звук", name: "Кодеки", value: "LDAC, AAC, SBC (Hi-Res Audio)" },
    ],
  },
  {
    name: "Apple AirPods Max USB-C (2024)",
    slug: "apple-airpods-max-usbc-2024",
    description: "Полноразмерные наушники с динамическими драйверами Apple, цифровым шумоподавлением, режимом прозрачности и портом зарядки USB-C.",
    price: 1199900, // 11,999 MDL
    stock: 20,
    isFeatured: false,
    categorySlug: "headphones",
    brandSlug: "apple",
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Драйверы", name: "Излучатель", value: "Apple-designed 40mm Dynamic Driver" },
      { groupName: "Звук", name: "Аудио", value: "Personalized Spatial Audio with Head Tracking" },
      { groupName: "Разъем", name: "Зарядка", value: "USB-C Port" },
    ],
  },
  {
    name: "Bose QuietComfort Ultra",
    slug: "bose-quietcomfort-ultra",
    description: "Премиальные наушники Bose с запатентованной технологией Immersive Audio для объемного звучания и отделкой из мягкой натуральной кожи.",
    price: 899900, // 8,999 MDL
    stock: 22,
    isFeatured: false,
    categorySlug: "headphones",
    brandSlug: "bose",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Звук", name: "Технология", value: "Bose Immersive Audio & CustomTune" },
      { groupName: "Батарея", name: "Автономность", value: "24 Hours Playback" },
      { groupName: "Режимы", name: "Шумоподавление", value: "Quiet Mode, Aware Mode, Immersion Mode" },
    ],
  },

  // Smart Watches (3)
  {
    name: "Apple Watch Series 10 (2024)",
    slug: "apple-watch-series-10-2024",
    description: "Самые тонкие смарт-часы Apple с широким углом обзора Wide-Angle OLED, распознаванием апноэ во сне, глубиномером и динамиком.",
    price: 899900, // 8,999 MDL
    stock: 25,
    isFeatured: true,
    categorySlug: "smart-watches",
    brandSlug: "apple",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Дисплей", name: "Экран", value: "Wide-Angle Always-On Retina OLED" },
      { groupName: "Корпус", name: "Размер / Цвет", value: "46mm Aluminum / Jet Black" },
      { groupName: "Здоровье", name: "Датчики", value: "Sleep Apnea Notifications, ECG, Blood Oxygen" },
    ],
  },
  {
    name: "Samsung Galaxy Watch 7 (2024)",
    slug: "samsung-galaxy-watch-7-2024",
    description: "Смарт-часы на 3-нм процессоре Exynos W1000 с обновленным сенсором BioActive, расчетом конечных продуктов гликирования (AGEs) и GPS L1+L5.",
    price: 599900, // 5,999 MDL
    stock: 40,
    isFeatured: false,
    categorySlug: "smart-watches",
    brandSlug: "samsung",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Процессор", name: "Чипсет", value: "3nm Exynos W1000 Penta-Core" },
      { groupName: "Датчики", name: "Мониторинг", value: "BioActive Sensor (HR, ECG, BIA, AGEs Index)" },
      { groupName: "Навигация", name: "GPS", value: "Dual-Frequency GPS (L1 + L5)" },
    ],
  },
  {
    name: "Garmin Fenix 8 Sapphire AMOLED (2024)",
    slug: "garmin-fenix-8-sapphire-2024",
    description: "Премиальные мультиспортивные часы с титановым безелем, AMOLED-дисплеем 1.4\", сапфировым стеклом, светодиодным фонариком и погружением до 40м.",
    price: 2199900, // 21,999 MDL
    stock: 12,
    isFeatured: false,
    categorySlug: "smart-watches",
    brandSlug: "garmin",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Дисплей", name: "Экран", value: "1.4\" AMOLED Sapphire Glass" },
      { groupName: "Батарея", name: "Автономность", value: "Up to 16 Days in Smartwatch Mode" },
      { groupName: "Функции", name: "Оснащение", value: "Built-in LED Flashlight, ECG, Dive 40m" },
    ],
  },

  // Accessories (3)
  {
    name: "Anker Prime 20,000mAh 200W Power Bank",
    slug: "anker-prime-20000mah-200w",
    description: "Мощнейший внешний аккумулятор 20 000 мАч с суммарной отдачей 200Вт (два порта USB-C по 100Вт каждый) и цветным дисплеем с индикацией ватт.",
    price: 249900, // 2,499 MDL
    stock: 50,
    isFeatured: false,
    categorySlug: "accessories",
    brandSlug: "anker",
    images: [
      "https://images.unsplash.com/photo-1609592424074-2ef5336bf7b1?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Емкость", name: "Батарея", value: "20,000 mAh (72Wh)" },
      { groupName: "Мощность", name: "Выход", value: "200W Total (Dual 100W USB-C Ports)" },
      { groupName: "Дисплей", name: "Экран", value: "Smart Digital Screen with Wattage Meters" },
    ],
  },
  {
    name: "Apple 140W USB-C Power Adapter",
    slug: "apple-140w-usbc-power-adapter",
    description: "Оригинальное сетевое зарядное устройство Apple мощностью 140 Вт на основе технологии GaN для быстрой зарядки MacBook Pro 16 до 50% за 30 минут.",
    price: 179900, // 1,799 MDL
    stock: 60,
    isFeatured: false,
    categorySlug: "accessories",
    brandSlug: "apple",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Мощность", name: "Технология", value: "140W GaN Fast Charge" },
      { groupName: "Протокол", name: "Стандарт", value: "USB Power Delivery 3.1" },
      { groupName: "Совместимость", name: "Устройства", value: "MacBook Pro, iPad Pro, iPhone" },
    ],
  },
  {
    name: "Anker MagGo 3-in-1 Wireless Charging Station",
    slug: "anker-maggo-3in1-wireless-station",
    description: "Складная алюминиевая док-станция 3-в-1 со стандартом Qi2 (15Вт MagSafe) для одновременной быстрой зарядки iPhone, Apple Watch и AirPods.",
    price: 199900, // 1,999 MDL
    stock: 45,
    isFeatured: false,
    categorySlug: "accessories",
    brandSlug: "anker",
    images: [
      "https://images.unsplash.com/photo-1622445268465-843d3a8a3a27?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Мощность", name: "Зарядка", value: "15W Qi2 Fast Wireless MagSafe" },
      { groupName: "Корпус", name: "Материал", value: "Premium Foldable Aluminum Travel Stand" },
      { groupName: "Совместимость", name: "Устройства", value: "iPhone, Apple Watch, AirPods 3-in-1" },
    ],
  },
];
