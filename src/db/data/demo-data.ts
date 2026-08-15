export const demoCategories = [
  {
    name: "Smartphones",
    slug: "smartphones",
    description: "Modern smartphones with vibrant screens, powerful cameras, and fast connectivity.",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "High-performance laptops for work, creative tasks, and mobile productivity.",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Tablets",
    slug: "tablets",
    description: "Versatile tablets with responsive displays for entertainment and notes.",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Headphones",
    slug: "headphones",
    description: "Premium wireless and studio headphones with active noise cancellation.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Smart Watches",
    slug: "smart-watches",
    description: "Smart wearables for fitness tracking, notifications, and health monitoring.",
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Essential chargers, power banks, and ergonomic stands for modern tech.",
    imageUrl: "https://images.unsplash.com/photo-1609592424074-2ef5336bf7b1?w=800&auto=format&fit=crop&q=80",
  },
];

export const demoBrands = [
  { name: "ZentoTech", slug: "zentotech", logoUrl: "brands/zentotech.webp" },
  { name: "Aura Audio", slug: "aura-audio", logoUrl: "brands/aura-audio.webp" },
  { name: "Nova Electronics", slug: "nova-electronics", logoUrl: "brands/nova-electronics.webp" },
  { name: "Pulse Lab", slug: "pulse-lab", logoUrl: "brands/pulse-lab.webp" },
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
    name: "Zento Nova Pro 5G",
    slug: "zento-nova-pro-5g",
    description: "Flagship smartphone featuring a 6.7-inch 120Hz OLED screen, triple camera system, and ultra-fast 5G processor.",
    price: 89900, // $899.00 / 89900 cents
    stock: 25,
    isFeatured: true,
    categorySlug: "smartphones",
    brandSlug: "zentotech",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "6.7 inch OLED 120Hz" },
      { groupName: "Performance", name: "Processor", value: "Octa-core 3.2GHz" },
      { groupName: "Memory", name: "RAM / Storage", value: "12GB RAM / 256GB NVMe" },
      { groupName: "Camera", name: "Main Camera", value: "50MP + 12MP Ultra-wide + 10MP Telephoto" },
    ],
  },
  {
    name: "Zento Pulse One",
    slug: "zento-pulse-one",
    description: "Compact smartphone with clean design, vibrant AMOLED screen, and all-day battery life.",
    price: 54900,
    stock: 40,
    isFeatured: false,
    categorySlug: "smartphones",
    brandSlug: "pulse-lab",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "6.1 inch AMOLED 90Hz" },
      { groupName: "Memory", name: "RAM / Storage", value: "8GB RAM / 128GB" },
      { groupName: "Battery", name: "Capacity", value: "4500 mAh" },
    ],
  },
  {
    name: "Zento Aura SE",
    slug: "zento-aura-se",
    description: "Essential smartphone with durable metallic frame, crystal-clear audio, and rapid charging.",
    price: 39900,
    stock: 15,
    isFeatured: false,
    categorySlug: "smartphones",
    brandSlug: "nova-electronics",
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "6.4 inch FHD+ IPS" },
      { groupName: "Memory", name: "RAM / Storage", value: "6GB RAM / 128GB" },
    ],
  },
  {
    name: "Zento HyperX 12",
    slug: "zento-hyperx-12",
    description: "Ultimate gaming and productivity smartphone with custom cooling system and high-efficiency battery.",
    price: 119900,
    stock: 10,
    isFeatured: true,
    categorySlug: "smartphones",
    brandSlug: "zentotech",
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "6.8 inch AMOLED 144Hz" },
      { groupName: "Performance", name: "Cooling", value: "Vapor Chamber Liquid Cooling" },
      { groupName: "Memory", name: "RAM / Storage", value: "16GB RAM / 512GB" },
    ],
  },

  // Laptops (4)
  {
    name: "Zento Book Pro 16",
    slug: "zento-book-pro-16",
    description: "Professional workstation laptop with 16-inch Mini-LED display, 32GB memory, and silent dual-fan cooling.",
    price: 189900,
    stock: 12,
    isFeatured: true,
    categorySlug: "laptops",
    brandSlug: "zentotech",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "16-inch 3.2K Mini-LED 120Hz" },
      { groupName: "Performance", name: "CPU", value: "14-core Processor" },
      { groupName: "Memory", name: "RAM / SSD", value: "32GB Unified RAM / 1TB SSD" },
    ],
  },
  {
    name: "Zento Book Air 14",
    slug: "zento-book-air-14",
    description: "Ultra-slim 14-inch aluminum notebook designed for mobile productivity and 18-hour battery longevity.",
    price: 119900,
    stock: 30,
    isFeatured: false,
    categorySlug: "laptops",
    brandSlug: "zentotech",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "14-inch Retina 60Hz" },
      { groupName: "Weight", name: "Weight", value: "1.24 kg" },
      { groupName: "Memory", name: "RAM / SSD", value: "16GB RAM / 512GB SSD" },
    ],
  },
  {
    name: "Zento Studio Max 15",
    slug: "zento-studio-max-15",
    description: "Creative laptop with color-calibrated 4K OLED touch display and dedicated graphics engine.",
    price: 219900,
    stock: 8,
    isFeatured: true,
    categorySlug: "laptops",
    brandSlug: "nova-electronics",
    images: [
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "15.6-inch 4K OLED Touch" },
      { groupName: "Graphics", name: "GPU", value: "Dedicated 8GB VRAM" },
      { groupName: "Memory", name: "RAM / SSD", value: "32GB RAM / 2TB SSD" },
    ],
  },
  {
    name: "Zento Craft 13",
    slug: "zento-craft-13",
    description: "Compact 13-inch laptop with tactile glass trackpad and fanless quiet operation.",
    price: 89900,
    stock: 22,
    isFeatured: false,
    categorySlug: "laptops",
    brandSlug: "pulse-lab",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "13.3-inch FHD IPS" },
      { groupName: "Memory", name: "RAM / SSD", value: "8GB RAM / 256GB SSD" },
    ],
  },

  // Tablets (3)
  {
    name: "Zento Tab Pro 11",
    slug: "zento-tab-pro-11",
    description: "High-performance 11-inch tablet with stylus support, quad-speaker audio, and magnetic keyboard connector.",
    price: 74900,
    stock: 18,
    isFeatured: true,
    categorySlug: "tablets",
    brandSlug: "zentotech",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "11-inch 120Hz Liquid Retina" },
      { groupName: "Audio", name: "Speakers", value: "Quad Stereo Speakers" },
      { groupName: "Memory", name: "Storage", value: "256GB" },
    ],
  },
  {
    name: "Zento Slate Air",
    slug: "zento-slate-air",
    description: "Featherlight 10.5-inch tablet tailored for reading, video streaming, and digital sketching.",
    price: 44900,
    stock: 35,
    isFeatured: false,
    categorySlug: "tablets",
    brandSlug: "pulse-lab",
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "10.5-inch 2K IPS" },
      { groupName: "Memory", name: "Storage", value: "128GB" },
    ],
  },
  {
    name: "Zento Pad Lite 10",
    slug: "zento-pad-lite-10",
    description: "Affordable family tablet with durable casing, eye-care display mode, and parent controls.",
    price: 24900,
    stock: 50,
    isFeatured: false,
    categorySlug: "tablets",
    brandSlug: "nova-electronics",
    images: [
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "10.1-inch HD LCD" },
      { groupName: "Memory", name: "Storage", value: "64GB" },
    ],
  },

  // Headphones (3)
  {
    name: "Zento Audio Pro Wireless",
    slug: "zento-audio-pro-wireless",
    description: "Over-ear headphones with adaptive active noise cancellation, custom 40mm drivers, and 40-hour playback.",
    price: 29900,
    stock: 45,
    isFeatured: true,
    categorySlug: "headphones",
    brandSlug: "aura-audio",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Audio", name: "Driver Size", value: "40mm Dynamic Driver" },
      { groupName: "Noise Control", name: "ANC", value: "Hybrid Active Noise Cancellation" },
      { groupName: "Battery", name: "Playtime", value: "Up to 40 Hours" },
    ],
  },
  {
    name: "Zento Studio Sound ANC",
    slug: "zento-studio-sound-anc",
    description: "Studio-grade audiophile headphones with lossless wireless codec support and memory foam ear cushions.",
    price: 39900,
    stock: 20,
    isFeatured: false,
    categorySlug: "headphones",
    brandSlug: "aura-audio",
    images: [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Audio", name: "Frequency Response", value: "10Hz - 40kHz" },
      { groupName: "Codec", name: "Supported Codecs", value: "LDAC, AAC, SBC" },
    ],
  },
  {
    name: "Zento AirBuds Neo",
    slug: "zento-airbuds-neo",
    description: "True wireless earbuds with compact charging case, IPX5 water resistance, and instant Bluetooth pairing.",
    price: 12900,
    stock: 60,
    isFeatured: false,
    categorySlug: "headphones",
    brandSlug: "pulse-lab",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Connectivity", name: "Bluetooth", value: "Bluetooth 5.3" },
      { groupName: "Protection", name: "Water Resistance", value: "IPX5" },
      { groupName: "Battery", name: "Total Playtime", value: "28 Hours with Case" },
    ],
  },

  // Smart Watches (3)
  {
    name: "Zento Horizon Watch GT",
    slug: "zento-horizon-watch-gt",
    description: "Premium smart watch with sapphire glass, titanium casing, ECG monitoring, and dual-frequency GPS.",
    price: 34900,
    stock: 28,
    isFeatured: true,
    categorySlug: "smart-watches",
    brandSlug: "zentotech",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "1.43-inch Always-On AMOLED" },
      { groupName: "Sensors", name: "Health", value: "Heart Rate, SpO2, ECG, Sleep" },
      { groupName: "Material", name: "Case Material", value: "Grade 5 Titanium & Sapphire" },
    ],
  },
  {
    name: "Zento Fit Band 3",
    slug: "zento-fit-band-3",
    description: "Lightweight fitness tracker with 14-day battery life, 50+ workout modes, and water resistance up to 50m.",
    price: 6900,
    stock: 80,
    isFeatured: false,
    categorySlug: "smart-watches",
    brandSlug: "pulse-lab",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Battery", name: "Life", value: "14 Days Typical Use" },
      { groupName: "Waterproof", name: "Rating", value: "5 ATM (50m)" },
    ],
  },
  {
    name: "Zento Watch Active",
    slug: "zento-watch-active",
    description: "Sports smartwatch with rugged silicone strap, built-in speaker for calls, and customizable watch faces.",
    price: 18900,
    stock: 35,
    isFeatured: false,
    categorySlug: "smart-watches",
    brandSlug: "nova-electronics",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Display", name: "Screen Size", value: "1.39-inch HD Screen" },
      { groupName: "Features", name: "Calling", value: "Bluetooth Voice Calling" },
    ],
  },

  // Accessories (3)
  {
    name: "Zento PowerBank 20000mAh",
    slug: "zento-powerbank-20000mah",
    description: "High-capacity power bank with 65W Power Delivery, digital status screen, and triple output ports.",
    price: 6900,
    stock: 75,
    isFeatured: false,
    categorySlug: "accessories",
    brandSlug: "zentotech",
    images: [
      "https://images.unsplash.com/photo-1609592424074-2ef5336bf7b1?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Capacity", name: "Battery Size", value: "20,000 mAh" },
      { groupName: "Power", name: "Max Output", value: "65W USB-C PD" },
    ],
  },
  {
    name: "Zento GaN Charger 65W",
    slug: "zento-gan-charger-65w",
    description: "Compact Gallium Nitride fast charger with 2x USB-C and 1x USB-A ports for laptops, phones, and tablets.",
    price: 4500,
    stock: 90,
    isFeatured: false,
    categorySlug: "accessories",
    brandSlug: "nova-electronics",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Technology", name: "Semiconductor", value: "GaN Fast Charge" },
      { groupName: "Ports", name: "Total Ports", value: "2x USB-C + 1x USB-A" },
    ],
  },
  {
    name: "Zento MagStand Pro Wireless",
    slug: "zento-magstand-pro-wireless",
    description: "3-in-1 magnetic wireless charging stand for smartphone, smartwatch, and wireless earbuds simultaneously.",
    price: 8900,
    stock: 40,
    isFeatured: false,
    categorySlug: "accessories",
    brandSlug: "aura-audio",
    images: [
      "https://images.unsplash.com/photo-1622445268465-843d3a8a3a27?w=800&auto=format&fit=crop&q=80",
    ],
    specs: [
      { groupName: "Output", name: "Wireless Output", value: "15W Fast Wireless" },
      { groupName: "Compatibility", name: "Devices", value: "Phone, Watch, Earbuds 3-in-1" },
    ],
  },
];
