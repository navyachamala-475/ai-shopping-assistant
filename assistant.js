const chatEl = document.getElementById("chat");
const form = document.getElementById("chat-form");
const inputEl = document.getElementById("user-input");

let lastRecommended = [];

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = "msg " + sender;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function extractPrice(text) {
  const match = text.match(/(?:under|below|less than)\s*(?:rs\.?|₹)?\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function extractSize(text) {
  const match = text.match(/size\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function extractCategory(text) {
  const categories = ["running shoes", "walking shoes", "casual sneakers", "sports shoes", "gym shoes"];
  const lower = text.toLowerCase();
  for (const c of categories) {
    if (lower.includes(c) || lower.includes(c.split(" ")[0])) return c;
  }
  return null;
}

function extractFeatures(text) {
  const knownFeatures = [
    "flat feet", "arch support", "lightweight", "breathable", "wide fit",
    "water resistant", "ankle support", "cushioned", "stylish", "everyday"
  ];
  const lower = text.toLowerCase();
  return knownFeatures.filter(f => lower.includes(f));
}

function scoreProduct(product, { price, category, features, size }) {
  let score = 0;
  if (price && product.price <= price) score += 3;
  if (price && product.price > price) score -= 5;
  if (category && product.category.includes(category.split(" ")[0])) score += 3;
  if (features.length) {
    const featureText = product.features.join(" ").toLowerCase();
    features.forEach(f => { if (featureText.includes(f)) score += 2; });
  }
  if (size && product.sizes.includes(size)) score += 1;
  return score;
}

function recommend(text) {
  const price = extractPrice(text);
  const category = extractCategory(text);
  const features = extractFeatures(text);
  const size = extractSize(text);

  const scored = PRODUCTS
    .map(p => ({ product: p, score: scoreProduct(p, { price, category, features, size }) }))
    .filter(s => s.score > -5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  lastRecommended = scored.map(s => s.product);

  if (!scored.length || scored[0].score <= 0) {
    return "I couldn't find a strong match. Try telling me a category (like running shoes), a budget, or a feature you need (like flat feet support).";
  }

  let reply = "Here's what I'd recommend:\n\n";
  scored.forEach(({ product }, i) => {
    reply += `${i + 1}. ${product.name} — ₹${product.price}\n   ${product.features.join(", ")}\n`;
  });
  reply += "\nWant to know sizes, or ask me to compare any two of these?";
  return reply;
}

function answerFollowUp(text) {
  const lower = text.toLowerCase();
  const size = extractSize(text);

  if (size && lastRecommended.length) {
    const inStock = lastRecommended.filter(p => p.sizes.includes(size));
    if (inStock.length) {
      return `Yes — available in size ${size}: ${inStock.map(p => p.name).join(", ")}.`;
    }
    return `None of the recommended options come in size ${size}. Available sizes across those picks: ${[...new Set(lastRecommended.flatMap(p => p.sizes))].sort((a,b)=>a-b).join(", ")}.`;
  }

  if (lower.includes("compare") && lastRecommended.length >= 2) {
    const [a, b] = lastRecommended;
    return `${a.name} (₹${a.price}): ${a.features.join(", ")}\nvs\n${b.name} (₹${b.price}): ${b.features.join(", ")}\n\n${a.price < b.price ? a.name : b.name} is the cheaper option.`;
  }

  return null;
}

function handleMessage(text) {
  const followUp = answerFollowUp(text);
  if (followUp) return followUp;
  return recommend(text);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  addMessage(text, "user");
  inputEl.value = "";
  setTimeout(() => {
    const reply = handleMessage(text);
    addMessage(reply, "bot");
  }, 300);
});

addMessage("Hi! Tell me what you're shopping for — for example: \"running shoes under 3000 for flat feet\"", "bot");
