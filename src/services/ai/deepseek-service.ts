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
    if (lastUserMsg.includes("телефон") || lastUserMsg.includes("смартфон") || lastUserMsg.includes("iphone") || lastUserMsg.includes("samsung")) {
      return "В каталоге Zento отличный выбор флагманских смартфонов 2024 года! Если вам нужна максимальная экосистема и лучшая видеосъемка — рекомендую **Apple iPhone 16 Pro Max** на чипе A18 Pro. Если вы предпочитаете Android с искусственным интеллектом Galaxy AI и пером S Pen — обратите внимание на **Samsung Galaxy S24 Ultra**.";
    }
    if (lastUserMsg.includes("ноутбук") || lastUserMsg.includes("macbook") || lastUserMsg.includes("thinkpad") || lastUserMsg.includes("asus") || lastUserMsg.includes("работы")) {
      return "Для продуктивной работы и учебы отлично подойдут: ультратонкий и автономный **Apple MacBook Air 15 M3** (до 18 часов работы без подзарядки) или надежный корпоративный ультрабук **Lenovo ThinkPad X1 Carbon Gen 12** из карбонового волокна. Для тяжелого видеомонтажа и 3D-графики — флагманский **MacBook Pro 16 M3 Max**.";
    }
    if (lastUserMsg.includes("наушник") || lastUserMsg.includes("звук") || lastUserMsg.includes("sony") || lastUserMsg.includes("airpods") || lastUserMsg.includes("bose")) {
      return "Среди наушников с топовым шумоподавлением безусловные лидеры — **Sony WH-1000XM5** (с поддержкой Hi-Res LDAC и 8 микрофонами ANC) и премиальные **Apple AirPods Max (USB-C)** с пространственным аудио. Также великолепный объемный звук предлагают **Bose QuietComfort Ultra**.";
    }
    if (lastUserMsg.includes("час") || lastUserMsg.includes("watch") || lastUserMsg.includes("garmin") || lastUserMsg.includes("спорт")) {
      return "Для спорта, экстремального туризма и автономности до 16 дней идеально подходят титановые **Garmin Fenix 8 Sapphire AMOLED**. Для повседневного мониторинга здоровья и интеграции с iPhone — тонкие **Apple Watch Series 10**, а для Android — **Samsung Galaxy Watch 7**.";
    }
    return "В интернет-магазине Zento представлена оригинальная цифровая техника ведущих мировых брендов: Apple, Samsung, Xiaomi, Sony, ASUS, Lenovo, Garmin и Bose с официальной гарантией. Что именно вас интересует — смартфоны, ноутбуки, планшеты, наушники или смарт-часы?";
  }

  // Romanian responses
  if (locale === "ro") {
    return "În magazinul Zento găsiți tehnică digitală originală de la cele mai bune branduri: Apple, Samsung, Sony, ASUS, Garmin și Bose. Vă pot ajuta să alegeți laptopuri, smartphone-uri, căști sau ceasuri inteligente adaptate bugetului dvs.";
  }

  // English responses
  return "Welcome to Zento! We offer top-tier flagship tech from Apple, Samsung, Sony, ASUS, Lenovo, Garmin, and Bose with official warranty. How can I assist you with choosing the right device today?";
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

Правила:
1. Рекомендуй ТОЛЬКО товары, которые есть в каталоге Zento (список ниже).
2. Цены указывай в MDL (молдавских леях).
3. Отвечай на том языке, на котором пишет клиент (${locale === "ro" ? "румынский" : locale === "en" ? "английский" : "русский"}).
4. Выделяй названия ключевых рекомендуемых моделей жирным шрифтом (например: **Apple iPhone 16 Pro Max**).
5. Будь кратким, полезным и вежливым. Не пиши слишком длинных простыней текста.

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
