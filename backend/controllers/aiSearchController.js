import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "for", "from", "i", "in", "is", "me", "my",
  "of", "on", "or", "please", "show", "some", "the", "to", "want", "with",
]);

const FOOD_SYNONYMS = {
  pizza: ["pizzas", "cheese", "margherita"],
  burger: ["burgers", "hamburger", "cheeseburger"],
  burgers: ["burger", "hamburger", "cheeseburger"],
  biryani: ["rice", "biryani"],
  rice: ["biryani", "fried rice", "chinese"],
  chicken: ["chicken", "non veg"],
  vegetarian: ["veg", "vegetarian"],
  veg: ["vegetarian", "vegetables"],
  dessert: ["desserts", "cake", "ice cream", "sweet"],
  desserts: ["dessert", "cake", "ice cream", "sweet"],
  sweet: ["dessert", "cake", "ice cream"],
  snack: ["snacks", "fast food", "fries", "sandwich"],
  snacks: ["snack", "fast food", "fries", "sandwich"],
  breakfast: ["sandwich", "burger", "south indian", "north indian"],
  chinese: ["noodles", "fried rice", "manchurian"],
  noodles: ["chinese", "noodles"],
  fast: ["fast food", "burger", "pizza", "sandwich"],
  spicy: ["spicy", "chicken", "chinese"],
  light: ["sandwich", "salad", "snack"],
};

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokens = (value = "") =>
  normalize(value)
    .split(" ")
    .filter((term) => term.length > 1 && !STOP_WORDS.has(term));

const buildSearchTerms = (query) => {
  const base = tokens(query);
  const expanded = new Set(base);
  for (const term of base) {
    for (const synonym of FOOD_SYNONYMS[term] || []) {
      for (const synonymTerm of tokens(synonym)) expanded.add(synonymTerm);
    }
  }
  return [...expanded];
};

const itemText = (item, shop) =>
  normalize(
    [item.name, item.category, item.foodType, shop?.name, shop?.description].join(" "),
  );

const keywordMatches = (query, itemsWithShops) => {
  const normalizedQuery = normalize(query);
  const queryTerms = tokens(query);
  const searchTerms = buildSearchTerms(query);

  return itemsWithShops
    .map(({ item, shop }) => {
      const name = normalize(item.name);
      const category = normalize(item.category);
      const foodType = normalize(item.foodType);
      const shopName = normalize(shop?.name);
      const haystack = itemText(item, shop);
      let score = 0;

      if (normalizedQuery && name === normalizedQuery) score += 100;
      if (normalizedQuery && name.includes(normalizedQuery)) score += 45;

      for (const term of queryTerms) {
        if (name.split(" ").includes(term)) score += 20;
        else if (name.includes(term)) score += 12;
        if (category.split(" ").includes(term)) score += 16;
        else if (category.includes(term)) score += 8;
        if (foodType.includes(term)) score += 10;
        if (shopName.includes(term)) score += 5;
        if (haystack.includes(term)) score += 2;
      }

      for (const term of searchTerms) {
        if (name.includes(term)) score += 3;
        if (category.includes(term)) score += 5;
        if (foodType.includes(term)) score += 4;
      }

      for (const term of queryTerms) {
        if (term.length < 4) continue;
        for (const nameTerm of name.split(" ")) {
          if (Math.abs(nameTerm.length - term.length) > 1) continue;
          let differences = 0;
          const maxLength = Math.max(nameTerm.length, term.length);
          for (let i = 0; i < maxLength; i += 1) {
            if (nameTerm[i] !== term[i]) differences += 1;
          }
          if (differences <= 1) score += 10;
        }
      }

      return { item, shop, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ item, shop }) => ({ item, shop }));
};

const parseGeminiJson = (text) => {
  const match = String(text || "").match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Gemini did not return JSON");
  return JSON.parse(match[0]);
};

const catalogEntry = ({ item, shop }) => ({
  id: String(item._id),
  name: item.name,
  category: item.category,
  foodType: item.foodType,
  price: item.price,
  shopId: shop?._id ? String(shop._id) : null,
  shopName: shop?.name || "",
});

const loadCatalog = async () => {
  const items = await Item.find({}).lean();
  const shopIds = items.map((item) => item.shop).filter(Boolean);
  const shops = await Shop.find({ _id: { $in: shopIds } })
    .select("name description image city")
    .lean();
  const shopMap = new Map(shops.map((shop) => [String(shop._id), shop]));

  return items.map((item) => ({
    item,
    shop: item.shop ? shopMap.get(String(item.shop)) : null,
  }));
};

// POST /api/item/ai-search
export const aiItemSearch = async (req, res) => {
  const query = String(req.body?.query || "").trim();

  if (query.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Please enter at least 2 characters.",
    });
  }

  if (query.length > 300) {
    return res.status(400).json({
      success: false,
      message: "Search request is too long.",
    });
  }

  try {
    const catalog = await loadCatalog();

    if (!catalog.length) {
      return res.json({
        success: true,
        items: [],
        answer: "There are no food items available right now.",
        source: "catalog",
      });
    }

    const fallbackMatches = keywordMatches(query, catalog);

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        items: fallbackMatches
          .slice(0, 6)
          .map(({ item, shop }) => ({ ...item, shop })),
        answer: fallbackMatches.length
          ? "Here are the best matches I found for you."
          : "I could not find a matching food item.",
        source: "catalog",
      });
    }

    const prompt = `You are the AI food-finding assistant for a food-delivery app. Use ONLY the food items in the catalog below. Understand exact names, partial names, misspellings, categories, veg/non-veg preferences, restaurant names, cravings, meal occasions, and natural-language food requests. Return strict JSON only in this exact shape: {"answer":"one short helpful sentence","itemIds":["catalog id"]}. Return at most 6 itemIds. Every itemId MUST be copied exactly from the catalog. Never invent an id. If nothing reasonably matches, return an empty itemIds array.\n\nCATALOG:\n${JSON.stringify(catalog.map(catalogEntry))}\n\nCUSTOMER REQUEST:\n${query}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(15000),
      },
    );

    if (!response.ok) throw new Error(`Gemini request failed (${response.status})`);

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    const aiResult = parseGeminiJson(text);
    const requestedIds = Array.isArray(aiResult.itemIds)
      ? aiResult.itemIds.map(String)
      : [];

    const byId = new Map(
      catalog.map(({ item, shop }) => [String(item._id), { item, shop }]),
    );
    const aiMatches = requestedIds
      .map((id) => byId.get(id))
      .filter(Boolean)
      .slice(0, 6);

    const selectedIds = new Set(aiMatches.map(({ item }) => String(item._id)));
    const merged = [...aiMatches];
    for (const match of fallbackMatches) {
      if (merged.length >= 6) break;
      const id = String(match.item._id);
      if (!selectedIds.has(id)) {
        selectedIds.add(id);
        merged.push(match);
      }
    }

    return res.json({
      success: true,
      items: merged.map(({ item, shop }) => ({ ...item, shop })),
      answer:
        typeof aiResult.answer === "string" && aiResult.answer.trim()
          ? aiResult.answer.trim()
          : merged.length
            ? "Here are the food items that best match your request."
            : "I could not find a matching food item.",
      source: aiMatches.length ? "gemini" : "catalog",
    });
  } catch (error) {
    console.error("AI food search:", error.message);

    try {
      const catalog = await loadCatalog();
      const matches = keywordMatches(query, catalog);
      return res.json({
        success: true,
        items: matches
          .slice(0, 6)
          .map(({ item, shop }) => ({ ...item, shop })),
        answer: matches.length
          ? "Here are the best matches I found for you."
          : "I could not find a matching food item.",
        source: "catalog",
      });
    } catch (catalogError) {
      console.error("Catalog search fallback:", catalogError.message);
      return res.status(500).json({
        success: false,
        message: "Unable to search food items right now.",
      });
    }
  }
};
