import { demoProducts, demoCategories, demoBrands } from "../../db/data/demo-data";
import { searchCatalog } from "../search/search-service";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface RecommendedProductCard {
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  brand: string;
}

export interface AiChatResponse {
  reply: string;
  products: RecommendedProductCard[];
  provider: "deepseek" | "local-smart";
}

/**
 * Builds compact catalog knowledge base for the system prompt
 */
function buildCatalogKnowledge(): string {
  return demoProducts
    .map((p) => {
      const priceMdl = (p.price / 100).toLocaleString("ru");
      const specsSummary = p.specs.map((s) => `${s.name}: ${s.value}`).join(", ");
      return `- ${p.name} [slug: ${p.slug}]: ${priceMdl} MDL. Категория: ${p.categorySlug}, Бренд: ${p.brandSlug}. Характеристики: ${specsSummary}. Описание: ${p.description}`;
    })
    .join("\n");
}

/**
 * Extracts product cards mentioned in the text or relevant to the query
 */
export async function extractRelevantProducts(
  text: string,
  userQuery: string
): Promise<RecommendedProductCard[]> {
  const combined = `${userQuery} ${text}`.toLowerCase();
  const matched: RecommendedProductCard[] = [];

  for (const p of demoProducts) {
    // Check if slug, name, or keywords are mentioned
    const nameMatch = p.name.toLowerCase().split(" ").some((word) => word.length > 3 && combined.includes(word));
    const slugMatch = combined.includes(p.slug);
    const brandMatch = combined.includes(p.brandSlug);

    if (slugMatch || (nameMatch && (combined.includes(p.categorySlug) || brandMatch))) {
      const cat = demoCategories.find((c) => c.slug === p.categorySlug)?.name || p.categorySlug;
      const br = demoBrands.find((b) => b.slug === p.brandSlug)?.name || p.brandSlug;
      
      matched.push({
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images[0] || "/products/placeholders/product.webp",
        category: cat,
        brand: br,
      });
    }

    if (matched.length >= 3) break;
  }

  // If no direct matches, use smart search catalog fallback
  if (matched.length === 0) {
    const searchRes = await searchCatalog({ query: userQuery, limit: 2 });
    for (const item of searchRes.items) {
      matched.push({
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.primaryImage || "/products/placeholders/product.webp",
        category: item.category.name,
        brand: item.brand.name,
      });
    }
  }

  return matched;
}

/**
 * Generates an intelligent offline response if DeepSeek API key is not configured
 */
function generateSmartLocalReply(
  messages: ChatMessage[],
  locale: string = "ru"
): string {
  const lastUserMsg = messages
    .filter((m) => m.role === "user")
    .pop()?.content.toLowerCase() || "";

  // Russian responses
  if (locale === "ru" || !locale) {
    // Physical address / offline store questions
    if (
      lastUserMsg.includes("адрес") ||
      lastUserMsg.includes("находит") ||
      lastUserMsg.includes("магазин") ||
      lastUserMsg.includes("шоурум") ||
      lastUserMsg.includes("самовывоз") ||
      lastUserMsg.includes("физическ") ||
      lastUserMsg.includes("где вы")
    ) {
      return "У нас нет физического магазина или шоурума — мы работаем исключительно как онлайн-магазин. Все заказы доставляются курьером прямо до вашей двери, а оплатить покупку можно наличными или картой при получении.";
    }

    // Delivery & payment questions
    if (lastUserMsg.includes("доставк") || lastUserMsg.includes("оплат") || lastUserMsg.includes("как купить") || lastUserMsg.includes("гаранти")) {
      return "Мы доставляем технику курьером по всей стране. Вы можете оплатить заказ при получении (наличными или картой курьеру) либо банковской картой онлайн на сайте с защитой 3D-Secure. На все товары действует официальная гарантия.";
    }

    // Contact & support questions
    if (lastUserMsg.includes("контакт") || lastUserMsg.includes("телефон") || lastUserMsg.includes("поддержк") || lastUserMsg.includes("почт")) {
      return "Служба поддержки Zento работает онлайн. Вы можете задать любой вопрос по характеристикам и подбору прямо здесь в чате или написать нам на support@zento.tech.";
    }

    // Product categories
    if (lastUserMsg.includes("телефон") || lastUserMsg.includes("смартфон") || lastUserMsg.includes("iphone") || lastUserMsg.includes("samsung") || lastUserMsg.includes("xiaomi") || lastUserMsg.includes("pixel")) {
      return "В каталоге Zento отличный выбор флагманских смартфонов 2024 года! Если вам нужна лучшая видеосъемка и экосистема — рекомендую **Apple iPhone 16 Pro Max** на чипе A18 Pro. Если вы предпочитаете Android с искусственным интеллектом Galaxy AI и пером S Pen — обратите внимание на **Samsung Galaxy S24 Ultra** или фотофлагман **Xiaomi 14 Ultra**.";
    }
    if (lastUserMsg.includes("ноутбук") || lastUserMsg.includes("macbook") || lastUserMsg.includes("thinkpad") || lastUserMsg.includes("asus") || lastUserMsg.includes("работы") || lastUserMsg.includes("учеб")) {
      return "Для продуктивной работы и учебы отлично подойдут: ультратонкий и автономный **Apple MacBook Air 15 M3** (до 18 часов работы) или надежный ультрабук **Lenovo ThinkPad X1 Carbon Gen 12** из карбонового волокна. Для тяжелых задач и 3D-графики — флагманский **MacBook Pro 16 M3 Max** или игровой **ASUS ROG Zephyrus G16**.";
    }
    if (lastUserMsg.includes("наушник") || lastUserMsg.includes("звук") || lastUserMsg.includes("sony") || lastUserMsg.includes("airpods") || lastUserMsg.includes("bose")) {
      return "Среди наушников с лучшим шумоподавлением безусловные лидеры — **Sony WH-1000XM5** (с поддержкой Hi-Res LDAC) и премиальные **Apple AirPods Max (USB-C)** с пространственным аудио. Также чистый объемный звук предлагают **Bose QuietComfort Ultra**.";
    }
    if (lastUserMsg.includes("час") || lastUserMsg.includes("watch") || lastUserMsg.includes("garmin") || lastUserMsg.includes("спорт")) {
      return "Для спорта, туризма и автономности до 16 дней идеально подходят титановые **Garmin Fenix 8 Sapphire AMOLED**. Для повседневного мониторинга здоровья — тонкие **Apple Watch Series 10**, а для смартфонов Samsung — **Samsung Galaxy Watch 7**.";
    }

    // Default polite out-of-scope response
    return "Я — виртуальный консультант интернет-магазина Zento и специализируюсь на подборе техники из нашего каталога. У меня нет точной информации по этому вопросу, но я с удовольствием помогу вам выбрать смартфон, ноутбук, планшет, наушники или смарт-часы!";
  }

  // Romanian responses
  if (locale === "ro") {
    if (lastUserMsg.includes("adres") || lastUserMsg.includes("magazin") || lastUserMsg.includes("unde")) {
      return "Nu avem un magazin fizic sau showroom — funcționăm exclusiv ca magazin online. Toate comenzile sunt livrate prin curier direct la ușa dvs., cu posibilitatea de a plăti la livrare sau online cu cardul.";
    }
    return "Sunt consultantul virtual Zento și vă ajut cu alegerea tehnicii din catalogul nostru. Dacă aveți întrebări despre smartphone-uri, laptopuri, căști sau ceasuri inteligente — vă ajut cu mare drag!";
  }

  // English responses
  if (lastUserMsg.includes("address") || lastUserMsg.includes("store") || lastUserMsg.includes("location") || lastUserMsg.includes("where")) {
    return "We operate exclusively as an online store with fast courier delivery to your door. We do not have a physical showroom, and all items can be purchased online with payment on delivery or via card.";
  }
  return "I am your Zento AI shopping assistant. While I might not have information on out-of-scope topics, I'd be glad to help you pick the best smartphone, laptop, tablet, headphones, or smartwatch from our catalog!";
}

/**
 * Main AI Chat Processor
 */
export async function processAiChat(
  messages: ChatMessage[],
  locale: string = "ru"
): Promise<AiChatResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .pop()?.content || "";

  // If DeepSeek API Key is available, use official DeepSeek Chat API
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const catalogKnowledge = buildCatalogKnowledge();

      const systemPrompt = `Ты — профессиональный, дружелюбный и экспертный AI-консультант интернет-магазина цифровой техники Zento.
Твоя цель: помогать клиентам подбирать товары под их задачи и бюджет, сравнивать устройства, объяснять сложные технические характеристики простым языком.

Правила поведения:
1. Рекомендуй ТОЛЬКО товары, которые есть в каталоге Zento (список ниже).
2. Цены указывай в MDL (молдавских леях).
3. Отвечай на том языке, на котором пишет клиент (${locale === "ro" ? "румынский" : locale === "en" ? "английский" : "русский"}).
4. Выделяй названия ключевых рекомендуемых моделей жирным шрифтом (например: **Apple iPhone 16 Pro Max**).
5. Будь кратким, полезным и вежливым. Не пиши слишком длинных простыней текста.
6. ЕСЛИ СПРАШИВАЮТ ПРО ФИЗИЧЕСКИЙ АДРЕС / ШОУРУМ / САМОВЫВОЗ: ответь вежливо и понятно: «У нас нет физического магазина или шоурума — мы работаем исключительно как онлайн-магазин с быстрой доставкой курьером прямо до вашей двери. Заказ можно оформить на сайте с оплатой при получении или картой онлайн.»
7. ЕСЛИ СПРАШИВАЮТ ПРО ТОВАР, КОТОРОГО НЕТ В КАТАЛОГЕ: вежливо объясни, что магазин специализируется на флагманской цифровой технике (смартфоны, ноутбуки, планшеты, аудио, часы, аксессуары), и предложи подходящий аналог из нашего каталога.
8. ЕСЛИ ВОПРОС НЕ ОТНОСИТСЯ К МАГАЗИНУ И ТЫ НЕ ЗНАЕШЬ ОТВЕТ: вежливо и спокойно объясни: «У меня нет информации по этому вопросу, так как я специализируюсь на консультации по каталогу техники Zento. Буду рад помочь вам с выбором гаджета или характеристиками!»

КАТАЛОГ ТОВАРОВ ZENTO:
${catalogKnowledge}`;

      const apiPayload = {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-6), // Keep recent context
        ],
        temperature: 0.7,
        max_tokens: 600,
      };

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(apiPayload),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.choices?.[0]?.message?.content || "";
        const products = await extractRelevantProducts(replyText, lastUserMessage);

        return {
          reply: replyText,
          products,
          provider: "deepseek",
        };
      } else {
        console.warn("DeepSeek API returned error:", response.status, await response.text());
      }
    } catch (err) {
      console.error("DeepSeek API connection exception:", err);
    }
  }

  // Graceful fallback to smart local assistant
  const localReply = generateSmartLocalReply(messages, locale);
  const products = await extractRelevantProducts(localReply, lastUserMessage);

  return {
    reply: localReply,
    products,
    provider: "local-smart",
  };
}
