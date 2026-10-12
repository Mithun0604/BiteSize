# BiteSize — Your Groceries, Understood.
> **AI-Powered Grocery & Nutrition Intelligence Platform**  
> *"Eat well. Spend wisely."*

BiteSize bridges the gap between what people buy, what they eat, and what they can afford. It connects receipt OCR scanning, precision AI meal recognition, personalized nutritional coaching, grocery budgeting, family coordination, and goal-based rewards with Bite Currency.

---

## 🌟 Key Features

### 1. AI-Powered Meal Photo Scanner (Highest Priority)
- **Calibrated Vision AI**: Identifies individual dishes and ingredients from photos or live camera captures.
- **Evidence-Based ICMR-NIN IFCT & USDA Database**: Nutrition is calculated strictly from verified 2024 Indian Food Composition Tables (over 100+ staples: dals, rotis, rice, idli, paneer, curd, chana, sprouts, veggies), never from invented or hallucinated numbers.
- **Honest Uncertainty Indicators**: Clearly displays confidence scores and visual uncertainty intervals (e.g., `±10%` to `±15%`).
- **Interactive Review & Calibrations**: Prompts users to confirm cooking methods (boiled, tempered with tadka, sautéed), portion weights in grams, and added fats/oils (ghee, butter, refined oil).
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
- **Big Bite (₹199/month)**: Unlimited receipt & meal scans, full AI Coach, What-If comparisons, meal planning, Bite Currency rewards.
- **Shared Bite (₹399/month)**: Everything in Big Bite + up to 5 family member profiles, shared household grocery budget & pantry, and confidential individual meal logs.
- **Verified Payment Handling**: Server-side plan limit enforcement, signature verification, and sandbox test mode.

### 7. Bite Currency Rewards & First Club Partner Program
- **7.5% Grocery Bill Reward**: Meeting monthly wellness and budget milestones unlocks 7.5% of eligible grocery spend in Bite Currency.
- **First Club Redemption Catalog**: Redeem Bite Currency for genuine voucher claim codes (₹100, ₹250, ₹500 off organic groceries).

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
  - **SQLite (Default Persistent Store)**: Zero-config, persistent `server/bitesize.db` with foreign keys, indexing, and seed data.
  - **MySQL 8.0 (Production Ready)**: Complete schema DDL provided in `server/config/schema.sql`.

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

## 👤 Instant Demo Login Credentials

The database comes pre-seeded with authentic Indian grocery receipts (Reliance Smart Bazaar, Blinkit), daily meal photo entries, pantry inventory, monthly budget, and Bite Currency rewards:

- **Email**: `demo@bitesize.app`
- **Password**: `bitesize123`
*(Or click the 1-Click "Sign In as Aarav (Demo User)" button on the login screen!)*

---

## ⚙️ Environment Variables (`server/.env`)

```env
PORT=5000
JWT_SECRET=bitesize_super_secret_jwt_key_2026

# Optional: Google Gemini API Key for multimodal Vision & AI Coach
# (If omitted, intelligent local nutrition & vision engine runs automatically)
GEMINI_API_KEY=

# Optional: Razorpay Payment Keys
# (If omitted, verified sandbox test mode runs automatically)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Optional: External MySQL Server Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=bitesize_db
```

---

## 🧪 Testing Verified Workflows

1. **Authentication**: Register a new user with custom dietary preferences and fitness targets, or use the 1-click demo login.
2. **Meal Scanner**: Navigate to "Scan Meal", upload any food photo, review the confidence rating and IFCT nutrition breakdown, adjust portion slider or cooking oil, and click "Confirm & Save to Daily Log".
3. **Receipt Scanner**: Upload a receipt image or PDF, inspect OCR line items, verify uncertain match flags, and watch ingredients auto-sync to your Pantry.
4. **AI Coach**: Chat with the coach regarding recipes or budget limits; witness contextually grounded responses citing your live pantry items and spending.
5. **"What If I Changed This?"**: Compare White Rice vs. Quinoa or Potato Chips vs. Roasted Makhana, review exact cost/calorie/protein differences, and click "Add to Shopping List".
6. **Pantry-to-Plate**: View expiry alerts, click "Cook this meal" to deduct quantities, or click "Add Missing Items" to update your smart shopping list.
7. **Subscription Upgrades**: Switch between Small Bite, Big Bite, and Shared Bite with verified sandbox Razorpay checkout.
8. **Bite Currency Rewards**: Track monthly milestone progress, see your 7.5% grocery reward, and claim First Club partner vouchers with generated claim codes.
9. **Data Export**: Export your personal nutrition and grocery spending history as CSV or JSON in 1 click.
