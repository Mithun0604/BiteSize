# BiteSize — Your Groceries, Understood.
> **AI-Powered Grocery & Nutrition Intelligence Platform**  
> *"Eat well. Spend wisely."*

BiteSize connects meal photo suggestions, receipt scanning, nutrition tracking, grocery budgeting, family coordination, and goal-based rewards with Bite Currency.

---

## 🌟 Key Features

### 1. Meal Photo Scanner
- **Free food-category model**: Runs a quantized ONNX image classifier in the Vercel backend. The public model weights are cached in the function's temporary storage.
- **Catalog-backed nutrition**: Suggestions are matched to BiteSize's curated food database. The model does not estimate ingredients, portion sizes, or nutrition.
- **User review**: Users confirm or search for the food, then set their portion and added fats or sauces before logging.
- **Daily Intake Logging**: Automatically saves confirmed meals to the daily intake log and calculates macro targets.

### 2. Receipt Scanner & Grocery Intelligence
- **Multimodal OCR Extraction**: Upload store receipt photos or PDFs (Reliance Smart, DMart, Blinkit, Zepto, Spencer's).
- **Line Item Decomposition**: Extracts item names, quantities, unit prices, discounts, taxes, and grand totals.
- **Aisle Categorization**: Auto-categorizes into *Grains & Pulses, Dairy & Eggs, Fresh Produce, Healthy Snacks, Pantry & Spices, Household*.
- **Uncertain Match Flags**: Highlights ambiguous product matches for user review before persisting.
- **Pantry Auto-Sync**: 1-click automatic import of purchased food items into your Pantry inventory.

### 3. BiteSize AI Coach
- **Context-Aware Conversational Assistant**: Grounded directly in your active database records:
  - Current pantry ingredients and expiring produce
  - Scanned supermarket receipts and monthly grocery budget
  - Logged meals and today's macro intake
  - Food allergies and fitness targets
- **Responsible AI Guardrails**: Strict allergy checking, medical disclaimers, non-judgmental tone, and plain-language answers.

### 4. “What If I Changed This?” Comparison Tool
- **Side-by-Side Trade-off Calculator**: Compare 2 food items, portions, or substitutes (e.g. *White Rice vs. Quinoa, Potato Chips vs. Roasted Makhana, Paratha vs. Multigrain Roti, Malai Paneer vs. Tofu*).
- **Exact Differences**: Calculates calorie difference, protein difference, fiber difference, and cost per serving difference (₹).
- **Goal Alignment**: Explains why the swap fits your specific goal (e.g., high protein recovery or lower calorie density).
- **1-Click Shopping List Action**: Add the chosen substitute directly to your Next-Basket shopping list.

### 5. Pantry-to-Plate AI & Smart Shopping List
- **Zero Food Waste Alerts**: Highlights ingredients expiring within 3 days.
- **Recipe Recommendations**: Recommends authentic healthy meals (e.g., *Palak Paneer Bhurji, Moong Dal Khichdi, Greek Yogurt Overnight Oats*) matched to ingredients currently in your pantry.
- **Inventory Deduction**: "Cook this meal" automatically deducts quantities from your pantry.
- **Smart Shopping List**: Categorized by supermarket aisles with estimated checkout costs and checkbox persistence.

### 6. Subscription System (Razorpay Integration)
- **Small Bite (Free)**: 3 receipt scans/mo, 10 meal scans/mo, 1 profile, baseline tracking.
- **Big Bite (₹199/month default)**: Higher receipt & meal scan limits, AI Coach, What-If comparisons, meal planning, and Bite Currency tracking.
- **Shared Bite (₹399/month default)**: Big Bite features plus up to 5 household member records and shared budget/pantry tools. Member records do not yet have separate sign-ins or role-based access.
- **Verified Payment Handling**: Server-side plan limit enforcement, signature verification, and sandbox test mode.

### 7. Bite Currency Rewards & First Club Partner Program
- **7.5% Grocery Bill Reward**: The illustrative reward is shown only after configured monthly goals are met.
- **First Club Demo Catalog**: Preview codes are simulated and cannot be redeemed; no partner integration is configured.

---

## 🎨 Visual Brand Identity & Colors

Built to strictly match the BiteSize Brand Identity guidelines:
- **Terracotta** (`#C75A3B`): Primary brand color, logos, CTAs, key actions.
- **Peach Blush** (`#F6D6C9`): Secondary highlights, illustrations, UI accents.
- **Warm Cream** (`#FAF8F4`): Main background for clean, minimal, calm feel.
- **Slate Blue** (`#5B6B7A`): Icons, secondary charts, informational cards.
- **Charcoal** (`#2E2E2E`): Headings, body text, high-contrast dark accents.
- **Mustard Gold** (`#D4A85A`): Milestones, rewards, Bite Currency.
- **Forest Green / Sage** (`#2E7D6B`): Positive outcomes, verified nutrition badges.
- **Playfair Display & Inter Typography**: Editorial elegance combined with modern UI hierarchy.

---

## 🛠️ Technology Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Lucide React icons, Canvas Confetti.
- **Backend**: Node.js & Express REST API with input validation, JWT session management, bcryptjs password hashing, and Multer file upload handling.
- **Database**:
  - **SQLite**: Local development database at `server/bitesize.db` with foreign keys and seed data.
  - **MySQL**: A reference schema is provided in `server/config/schema.sql`, but the current API runtime does not connect to MySQL.
  - **Production storage**: Vercel uses temporary `/tmp` storage for SQLite and uploads. Use a persistent database and object storage before relying on saved production data.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Clone or navigate to the project directory
cd MINOR

# Install root, backend, and frontend dependencies
npm run install:all
```

### Running the Application

To run both backend API (port 5000) and frontend development server (port 3000):
```bash
npm run dev
```

Alternatively, to run the standalone production server:
```bash
npm run build
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in your browser!

---

## 👤 Local Demo Login Credentials

In non-production development, the database is seeded with sample grocery receipts, meal entries, pantry inventory, budget, and rewards:

- **Email**: `demo@bitesize.app`
- **Password**: `bitesize123`
*(Or click the 1-Click "Sign In as Aarav (Demo User)" button on the login screen!)*

Production Vercel deployments seed this shared sample account only when ENABLE_DEMO_DATA=true is set. The account is shared and contains sample data; never use it for personal information. Demo sign-in requires this flag in production.

---

## ⚙️ Environment Variables (`server/.env`)

```env
PORT=5000
JWT_SECRET=replace-with-a-long-random-secret

# Required for receipt OCR and personalized AI Coach responses. Meal photo classification runs without this key.
# Without a key, these features report that setup is required; they do not generate sample results.
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.8-flash

# Configure both for live Razorpay checkout. Sandbox is disabled in production by default.
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
ENABLE_SANDBOX_PAYMENTS=false
BIG_BITE_PRICE_INR=199
SHARED_BITE_PRICE_INR=399

# Local SQLite is used by the current runtime; these MySQL values are not yet consumed.
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=bitesize_db
```

Set `JWT_SECRET`, `GEMINI_API_KEY` (for receipt OCR and AI Coach), and both Razorpay keys in Vercel before enabling the related features. Password recovery remains disabled until secure reset-email delivery and one-time token verification are implemented. The current runtime still uses ephemeral SQLite and `/tmp` uploads on Vercel, so it is not ready for persistent production user data.

---

## 🧪 Manual Workflow Checks

1. **Authentication**: Register a new user with custom dietary preferences and fitness targets, or use the local demo account.
2. **Meal Scanner**: Upload a JPG, PNG, or WebP photo up to 4 MB, confirm or search the food, set its portion, then save to the daily log. Photo classification runs in the Vercel backend and nutrition comes from the curated food database.
3. **Receipt Scanner**: Configure `GEMINI_API_KEY`, upload a receipt image or PDF, review extracted lines and uncertain matches, then confirm.
4. **AI Coach**: Configure `GEMINI_API_KEY` and ask about saved pantry, meal, and budget data.
5. **"What If I Changed This?"**: Compare White Rice vs. Quinoa or Potato Chips vs. Roasted Makhana, review exact cost/calorie/protein differences, and click "Add to Shopping List".
6. **Pantry-to-Plate**: View expiry alerts, click "Cook this meal" to deduct quantities, or click "Add Missing Items" to update your smart shopping list.
7. **Subscription Upgrades**: Use clearly labelled sandbox checkout in local development, or configure live Razorpay credentials and test the live Checkout callback.
8. **Bite Currency Rewards**: Track goal eligibility and the illustrative 7.5% grocery reward. First Club preview codes are not redeemable.
9. **Data Export**: Export your personal nutrition and grocery spending history as CSV or JSON in 1 click.
