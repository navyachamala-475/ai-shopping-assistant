# AI-Powered Agentic Commerce Assistant

**Track:** Track 1 — AI Growth & Agentic Commerce
**Built for:** Razorpay Buildathon 2026

## Problem it solves

Online shoppers struggle to find the right product among too many options. They can't easily
compare choices or get their specific questions answered, which leads to drop-off and lost
sales. Businesses lose customer engagement and conversions as a result.

## What it does

A chat-based shopping assistant that:
- Understands what a customer is looking for, described in plain language (budget, category, features)
- Recommends the best-matching products from the catalog
- Explains *why* each product was recommended
- Answers follow-up questions (sizes available, comparisons between recommended items)

## How it works

1. The customer types a request, e.g. *"running shoes under 3000 for flat feet"*
2. The assistant extracts key signals: budget, category, and required features
3. It scores every product in the catalog against those signals
4. It returns the top matches with a short explanation
5. Follow-up questions (sizing, comparisons) are answered using the same recommended set

## Tech

- Plain HTML/CSS/JS — no build step, no framework, no server required
- `products.js` — the product catalog (10 sample products across shoe categories)
- `assistant.js` — the matching and conversation logic
- `index.html` — the chat interface

## Run it

Just open `index.html` in any browser. No installation needed.

## Build challenges

- **Matching vague language to product attributes** — customers describe needs in natural
  language ("flat feet", "under 3000"), not exact filters. Solved by extracting structured
  signals (price ceiling, category, feature keywords) from free text before scoring products.
- **Keeping recommendations grounded** — every recommendation is checked against the real
  in-memory catalog, so the assistant never suggests something that isn't actually available.

## Possible extensions

- Swap the rule-based matcher for a real LLM API call for richer natural-language understanding
- Connect to a live product database instead of a static catalog
- Add order placement / checkout flow for true end-to-end agentic commerce
