/**
 * BiteSize Nutrition Database
 * Verified values per 100g based on Indian Food Composition Tables (IFCT, ICMR-NIN) and USDA FoodData Central.
 */

const foodDatabase = [
  // Grains & Staples
  {
    id: "rice_white_cooked",
    name: "Cooked White Rice (Basmati / Sona Masoori)",
    category: "Grains & Cereals",
    standardServingGrams: 150,
    servingUnit: "1 medium bowl (150g)",
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1 },
    micronutrients: { iron_mg: 0.2, calcium_mg: 10, potassium_mg: 35 },
    tags: ["staple", "vegetarian", "vegan", "gluten-free"],
    approxCostPerKg: 65,
    commonCookingVariations: ["Plain Boiled", "Steamed", "Fried Rice"]
  },
  {
    id: "rice_brown_cooked",
    name: "Cooked Brown Rice",
    category: "Grains & Cereals",
    standardServingGrams: 150,
    servingUnit: "1 medium bowl (150g)",
    per100g: { calories: 111, protein: 2.6, carbs: 23.0, fat: 0.9, fiber: 1.8, sugar: 0.4, sodium: 2 },
    micronutrients: { iron_mg: 0.5, calcium_mg: 11, potassium_mg: 84 },
    tags: ["staple", "vegetarian", "vegan", "gluten-free", "high-fiber"],
    approxCostPerKg: 110,
    commonCookingVariations: ["Boiled", "Pressure Cooked"]
  },
  {
    id: "quinoa_cooked",
    name: "Cooked Quinoa",
    category: "Grains & Cereals",
    standardServingGrams: 150,
    servingUnit: "1 medium bowl (150g)",
    per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7 },
    micronutrients: { iron_mg: 1.5, calcium_mg: 17, potassium_mg: 172 },
    tags: ["high-protein", "vegetarian", "vegan", "gluten-free", "high-fiber"],
    approxCostPerKg: 320,
    commonCookingVariations: ["Boiled", "Salad base"]
  },
  {
    id: "roti_chapati",
    name: "Whole Wheat Roti / Chapati (Tawa, no oil)",
    category: "Grains & Cereals",
    standardServingGrams: 40,
    servingUnit: "1 medium roti (40g)",
    per100g: { calories: 264, protein: 9.2, carbs: 54.0, fat: 1.7, fiber: 8.5, sugar: 1.2, sodium: 150 },
    micronutrients: { iron_mg: 3.5, calcium_mg: 30, potassium_mg: 280 },
    tags: ["staple", "vegetarian", "vegan", "whole-grain"],
    approxCostPerKg: 45,
    commonCookingVariations: ["Dry roasted", "With 1/2 tsp Ghee (+25 kcal)"]
  },
  {
    id: "paratha_plain",
    name: "Plain Tawa Paratha (with oil/ghee)",
    category: "Grains & Cereals",
    standardServingGrams: 60,
    servingUnit: "1 medium paratha (60g)",
    per100g: { calories: 335, protein: 7.5, carbs: 48.0, fat: 13.0, fiber: 6.0, sugar: 1.5, sodium: 220 },
    micronutrients: { iron_mg: 2.8, calcium_mg: 25, potassium_mg: 240 },
    tags: ["vegetarian"],
    approxCostPerKg: 60,
    commonCookingVariations: ["Shallow fried with ghee", "Stuffed Aloo (+40 kcal)"]
  },
  {
    id: "oats_rolled",
    name: "Rolled Oats (Raw / Porridge)",
    category: "Grains & Cereals",
    standardServingGrams: 50,
    servingUnit: "1 cup cooked (approx 50g raw)",
    per100g: { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, fiber: 10.6, sugar: 1.0, sodium: 2 },
    micronutrients: { iron_mg: 4.7, calcium_mg: 54, potassium_mg: 429 },
    tags: ["high-fiber", "high-protein", "vegetarian", "vegan"],
    approxCostPerKg: 190,
    commonCookingVariations: ["Cooked in water", "Cooked in milk", "Overnight oats"]
  },
  {
    id: "idli",
    name: "Steamed Idli (Fermented rice & urad dal)",
    category: "South Indian Breakfast",
    standardServingGrams: 50,
    servingUnit: "1 medium idli (50g)",
    per100g: { calories: 132, protein: 4.8, carbs: 26.5, fat: 0.8, fiber: 1.6, sugar: 0.3, sodium: 85 },
    micronutrients: { iron_mg: 0.9, calcium_mg: 18, potassium_mg: 70 },
    tags: ["steamed", "low-fat", "fermented", "gut-friendly", "vegetarian"],
    approxCostPerKg: 70,
    commonCookingVariations: ["Steamed"]
  },
  {
    id: "dosa_plain",
    name: "Plain Crisp Dosa (Crisp crepe)",
    category: "South Indian Breakfast",
    standardServingGrams: 80,
    servingUnit: "1 medium dosa (80g)",
    per100g: { calories: 168, protein: 4.2, carbs: 29.0, fat: 4.0, fiber: 1.4, sugar: 0.4, sodium: 110 },
    micronutrients: { iron_mg: 1.1, calcium_mg: 20, potassium_mg: 78 },
    tags: ["vegetarian", "fermented"],
    approxCostPerKg: 80,
    commonCookingVariations: ["Ghee Roast (+60 kcal)", "Masala Dosa with potato (+90 kcal)"]
  },

  // Pulses, Dals & Legumes
  {
    id: "dal_tadka_cooked",
    name: "Dal Tadka (Yellow Toor/Moong Dal tempered)",
    category: "Pulses & Legumes",
    standardServingGrams: 150,
    servingUnit: "1 katori / bowl (150g)",
    per100g: { calories: 118, protein: 6.8, carbs: 14.5, fat: 3.8, fiber: 4.2, sugar: 0.8, sodium: 210 },
    micronutrients: { iron_mg: 2.1, calcium_mg: 32, potassium_mg: 230 },
    tags: ["high-protein", "vegetarian", "vegan", "comfort-food"],
    approxCostPerKg: 140,
    commonCookingVariations: ["Ghee tadka", "Jeera garlic tadka", "Low oil"]
  },
  {
    id: "chana_masala",
    name: "Chana Masala / Chole Curry",
    category: "Pulses & Legumes",
    standardServingGrams: 180,
    servingUnit: "1 medium bowl (180g)",
    per100g: { calories: 142, protein: 7.2, carbs: 19.8, fat: 4.2, fiber: 5.6, sugar: 1.8, sodium: 280 },
    micronutrients: { iron_mg: 2.8, calcium_mg: 45, potassium_mg: 290 },
    tags: ["high-fiber", "high-protein", "vegan", "vegetarian"],
    approxCostPerKg: 120,
    commonCookingVariations: ["Punjabi style gravy", "Dry chana salad"]
  },
  {
    id: "rajma_curry",
    name: "Rajma Masala (Red Kidney Bean Curry)",
    category: "Pulses & Legumes",
    standardServingGrams: 180,
    servingUnit: "1 medium bowl (180g)",
    per100g: { calories: 135, protein: 7.0, carbs: 18.5, fat: 4.0, fiber: 5.2, sugar: 1.5, sodium: 260 },
    micronutrients: { iron_mg: 2.5, calcium_mg: 38, potassium_mg: 310 },
    tags: ["high-fiber", "high-protein", "vegan", "vegetarian"],
    approxCostPerKg: 160,
    commonCookingVariations: ["Onion-tomato gravy", "Mild spiced"]
  },
  {
    id: "moong_dal_sprouts",
    name: "Moong Sprouts (Raw / lightly steamed)",
    category: "Pulses & Legumes",
    standardServingGrams: 100,
    servingUnit: "1 cup (100g)",
    per100g: { calories: 105, protein: 7.8, carbs: 19.0, fat: 0.5, fiber: 7.6, sugar: 2.0, sodium: 15 },
    micronutrients: { iron_mg: 1.8, calcium_mg: 28, potassium_mg: 350 },
    tags: ["superfood", "high-fiber", "high-protein", "raw", "vegan"],
    approxCostPerKg: 130,
    commonCookingVariations: ["Raw Chaat with lemon", "Lightly steamed with mustard tempering"]
  },

  // Dairy & Alternatives
  {
    id: "paneer_raw",
    name: "Fresh Malai Paneer (Cottage Cheese)",
    category: "Dairy & Eggs",
    standardServingGrams: 100,
    servingUnit: "100g cubes",
    per100g: { calories: 295, protein: 18.3, carbs: 3.4, fat: 22.8, fiber: 0, sugar: 2.5, sodium: 25 },
    micronutrients: { iron_mg: 0.2, calcium_mg: 480, potassium_mg: 110 },
    tags: ["high-protein", "high-calcium", "vegetarian", "keto-friendly"],
    approxCostPerKg: 380,
    commonCookingVariations: ["Raw salad", "Tikka Grilled", "Curry cooked"]
  },
  {
    id: "tofu_firm",
    name: "Firm Soya Tofu",
    category: "Plant Proteins",
    standardServingGrams: 100,
    servingUnit: "100g block",
    per100g: { calories: 83, protein: 10.0, carbs: 1.9, fat: 5.3, fiber: 1.2, sugar: 0.5, sodium: 8 },
    micronutrients: { iron_mg: 2.7, calcium_mg: 280, potassium_mg: 120 },
    tags: ["low-calorie", "high-protein", "vegan", "lactose-free", "heart-healthy"],
    approxCostPerKg: 220,
    commonCookingVariations: ["Pan seared", "Tofu stir fry", "Curry"]
  },
  {
    id: "curd_plain_dahi",
    name: "Plain Curd / Dahi (Whole milk)",
    category: "Dairy & Eggs",
    standardServingGrams: 150,
    servingUnit: "1 medium bowl (150g)",
    per100g: { calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, sugar: 4.7, sodium: 46 },
    micronutrients: { iron_mg: 0.1, calcium_mg: 121, potassium_mg: 155 },
    tags: ["probiotic", "vegetarian", "calcium-rich"],
    approxCostPerKg: 70,
    commonCookingVariations: ["Plain chilled", "Raita with cucumber", "Chaas / Buttermilk"]
  },
  {
    id: "greek_yogurt_hung",
    name: "Hung Curd / Greek Style Yogurt (High Protein)",
    category: "Dairy & Eggs",
    standardServingGrams: 120,
    servingUnit: "1 small cup (120g)",
    per100g: { calories: 97, protein: 9.5, carbs: 3.6, fat: 5.0, fiber: 0, sugar: 3.5, sodium: 35 },
    micronutrients: { iron_mg: 0.1, calcium_mg: 140, potassium_mg: 180 },
    tags: ["high-protein", "probiotic", "vegetarian"],
    approxCostPerKg: 180,
    commonCookingVariations: ["Fruit yogurt bowl", "Dip/Spread"]
  },
  {
    id: "milk_cow_toned",
    name: "Toned Cow Milk (3% fat)",
    category: "Dairy & Eggs",
    standardServingGrams: 200,
    servingUnit: "1 glass (200ml)",
    per100g: { calories: 58, protein: 3.2, carbs: 4.8, fat: 3.0, fiber: 0, sugar: 4.8, sodium: 50 },
    micronutrients: { iron_mg: 0.1, calcium_mg: 120, potassium_mg: 150 },
    tags: ["vegetarian", "calcium-rich"],
    approxCostPerKg: 58,
    commonCookingVariations: ["Warm", "In tea/coffee"]
  },
  {
    id: "almond_milk_unsweetened",
    name: "Unsweetened Almond Milk",
    category: "Dairy Alternatives",
    standardServingGrams: 200,
    servingUnit: "1 glass (200ml)",
    per100g: { calories: 15, protein: 0.6, carbs: 0.3, fat: 1.2, fiber: 0.3, sugar: 0, sodium: 70 },
    micronutrients: { iron_mg: 0.3, calcium_mg: 150, potassium_mg: 60 },
    tags: ["low-calorie", "vegan", "lactose-free", "keto-friendly"],
    approxCostPerKg: 240,
    commonCookingVariations: ["Chilled", "Smoothie base"]
  },

  // Poultry, Eggs & Fish
  {
    id: "egg_boiled_whole",
    name: "Whole Boiled Egg (Large)",
    category: "Dairy & Eggs",
    standardServingGrams: 50,
    servingUnit: "1 large egg (50g)",
    per100g: { calories: 155, protein: 12.6, carbs: 1.1, fat: 10.6, fiber: 0, sugar: 0.4, sodium: 124 },
    micronutrients: { iron_mg: 1.8, calcium_mg: 50, potassium_mg: 126 },
    tags: ["high-protein", "keto-friendly", "non-veg"],
    approxCostPerKg: 140, // ~7-8 per egg
    commonCookingVariations: ["Hard boiled", "Poached", "Egg Bhurji"]
  },
  {
    id: "egg_white_boiled",
    name: "Boiled Egg White (Large)",
    category: "Dairy & Eggs",
    standardServingGrams: 33,
    servingUnit: "1 egg white (33g)",
    per100g: { calories: 52, protein: 10.9, carbs: 0.7, fat: 0.2, fiber: 0, sugar: 0.7, sodium: 166 },
    micronutrients: { iron_mg: 0.1, calcium_mg: 7, potassium_mg: 163 },
    tags: ["lean-protein", "fat-free", "low-calorie", "non-veg"],
    approxCostPerKg: 140,
    commonCookingVariations: ["Hard boiled"]
  },
  {
    id: "chicken_breast_grilled",
    name: "Skinless Chicken Breast (Grilled/Boiled)",
    category: "Poultry & Meat",
    standardServingGrams: 150,
    servingUnit: "1 piece / breast (150g)",
    per100g: { calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
    micronutrients: { iron_mg: 1.0, calcium_mg: 15, potassium_mg: 256 },
    tags: ["lean-protein", "high-protein", "low-carb", "non-veg"],
    approxCostPerKg: 320,
    commonCookingVariations: ["Pan grilled with herbs", "Boiled/Shredded", "Tandoori style"]
  },
  {
    id: "chicken_curry_homestyle",
    name: "Homestyle Chicken Curry (with gravy)",
    category: "Poultry & Meat",
    standardServingGrams: 200,
    servingUnit: "1 medium bowl (200g)",
    per100g: { calories: 175, protein: 18.5, carbs: 3.5, fat: 9.8, fiber: 0.8, sugar: 1.2, sodium: 290 },
    micronutrients: { iron_mg: 1.4, calcium_mg: 22, potassium_mg: 270 },
    tags: ["high-protein", "non-veg"],
    approxCostPerKg: 280,
    commonCookingVariations: ["Homestyle onion tomato curry", "Spicy Chettinad"]
  },
  {
    id: "fish_rohu_curry",
    name: "Rohu / Katla Fish Curry (Bengali / Coastal style)",
    category: "Fish & Seafood",
    standardServingGrams: 150,
    servingUnit: "1 piece with gravy (150g)",
    per100g: { calories: 140, protein: 16.2, carbs: 2.1, fat: 7.5, fiber: 0.5, sugar: 0.5, sodium: 240 },
    micronutrients: { iron_mg: 1.2, calcium_mg: 65, potassium_mg: 240 },
    tags: ["omega-3", "high-protein", "non-veg"],
    approxCostPerKg: 260,
    commonCookingVariations: ["Mustard gravy", "Tomato onion light broth"]
  },

  // Vegetables & Sabzis
  {
    id: "palak_paneer",
    name: "Palak Paneer (Spinach Cottage Cheese)",
    category: "Vegetables & Sabzi",
    standardServingGrams: 180,
    servingUnit: "1 medium bowl (180g)",
    per100g: { calories: 152, protein: 7.8, carbs: 4.6, fat: 11.5, fiber: 2.5, sugar: 1.8, sodium: 240 },
    micronutrients: { iron_mg: 2.4, calcium_mg: 180, potassium_mg: 210 },
    tags: ["iron-rich", "calcium-rich", "vegetarian"],
    approxCostPerKg: 220,
    commonCookingVariations: ["Light cream", "No cream homestyle"]
  },
  {
    id: "bhindi_masala",
    name: "Bhindi Masala (Okra sautéed with spices)",
    category: "Vegetables & Sabzi",
    standardServingGrams: 120,
    servingUnit: "1 medium katori (120g)",
    per100g: { calories: 92, protein: 2.1, carbs: 8.5, fat: 5.6, fiber: 3.4, sugar: 2.1, sodium: 180 },
    micronutrients: { iron_mg: 1.1, calcium_mg: 75, potassium_mg: 190 },
    tags: ["high-fiber", "low-calorie", "vegan", "vegetarian"],
    approxCostPerKg: 90,
    commonCookingVariations: ["Kurkuri crispy", "Onion spiced fry"]
  },
  {
    id: "aloo_gobhi",
    name: "Aloo Gobhi (Potato Cauliflower Sabzi)",
    category: "Vegetables & Sabzi",
    standardServingGrams: 150,
    servingUnit: "1 medium bowl (150g)",
    per100g: { calories: 115, protein: 2.5, carbs: 16.0, fat: 4.8, fiber: 2.9, sugar: 2.2, sodium: 210 },
    micronutrients: { iron_mg: 1.0, calcium_mg: 28, potassium_mg: 280 },
    tags: ["vegetarian", "vegan"],
    approxCostPerKg: 65,
    commonCookingVariations: ["Dry roasted", "Light gravy"]
  },
  {
    id: "mixed_vegetable_salad",
    name: "Indian Green Salad (Cucumber, Tomato, Carrot, Onion)",
    category: "Fresh Produce",
    standardServingGrams: 120,
    servingUnit: "1 plate (120g)",
    per100g: { calories: 25, protein: 1.0, carbs: 4.8, fat: 0.2, fiber: 1.8, sugar: 2.8, sodium: 12 },
    micronutrients: { iron_mg: 0.6, calcium_mg: 22, potassium_mg: 210 },
    tags: ["raw", "superfood", "hydration", "low-calorie", "vegan"],
    approxCostPerKg: 50,
    commonCookingVariations: ["With lemon and chaat masala", "Olive oil dressing"]
  },

  // Snacks & Comparison Candidates
  {
    id: "potato_chips_fried",
    name: "Classic Potato Chips (Deep fried, salted)",
    category: "Packaged Snacks",
    standardServingGrams: 50,
    servingUnit: "1 medium packet (50g)",
    per100g: { calories: 536, protein: 7.0, carbs: 53.0, fat: 34.0, fiber: 4.4, sugar: 0.3, sodium: 590 },
    micronutrients: { iron_mg: 1.6, calcium_mg: 24, potassium_mg: 1275 },
    tags: ["ultra-processed", "high-sodium", "high-fat"],
    approxCostPerKg: 400, // ₹20 for 50g
    commonCookingVariations: ["Packaged"]
  },
  {
    id: "roasted_makhana",
    name: "Roasted Fox Nuts / Makhana (Lightly spiced in ghee)",
    category: "Healthy Snacks",
    standardServingGrams: 40,
    servingUnit: "1 large bowl (40g)",
    per100g: { calories: 347, protein: 9.7, carbs: 64.5, fat: 6.2, fiber: 14.5, sugar: 0.5, sodium: 180 },
    micronutrients: { iron_mg: 3.5, calcium_mg: 60, potassium_mg: 500 },
    tags: ["superfood", "high-fiber", "low-glycemic", "vegetarian", "gluten-free"],
    approxCostPerKg: 700, // ₹35 for 50g
    commonCookingVariations: ["Dry roasted with turmeric and pinch of pink salt"]
  },
  {
    id: "samosa_potato",
    name: "Fried Potato Samosa",
    category: "Street Food & Snacks",
    standardServingGrams: 90,
    servingUnit: "1 large samosa (90g)",
    per100g: { calories: 295, protein: 4.2, carbs: 32.0, fat: 16.8, fiber: 2.1, sugar: 1.2, sodium: 340 },
    micronutrients: { iron_mg: 1.2, calcium_mg: 18, potassium_mg: 180 },
    tags: ["fried", "high-calorie", "vegetarian"],
    approxCostPerKg: 200, // ₹20 each
    commonCookingVariations: ["Deep fried"]
  },
  {
    id: "dhokla_khaman",
    name: "Steamed Khaman Dhokla",
    category: "Healthy Snacks",
    standardServingGrams: 80,
    servingUnit: "2 pieces (80g)",
    per100g: { calories: 152, protein: 5.5, carbs: 24.0, fat: 3.8, fiber: 2.2, sugar: 4.5, sodium: 290 },
    micronutrients: { iron_mg: 1.5, calcium_mg: 32, potassium_mg: 140 },
    tags: ["steamed", "fermented", "vegetarian"],
    approxCostPerKg: 180,
    commonCookingVariations: ["Steamed with mustard & green chili tempering"]
  },
  {
    id: "biryani_chicken",
    name: "Hyderabadi Chicken Biryani (with rice & pieces)",
    category: "Complete Meals",
    standardServingGrams: 350,
    servingUnit: "1 regular plate (350g)",
    per100g: { calories: 185, protein: 9.8, carbs: 22.5, fat: 6.5, fiber: 1.2, sugar: 1.0, sodium: 320 },
    micronutrients: { iron_mg: 1.6, calcium_mg: 28, potassium_mg: 220 },
    tags: ["high-protein", "non-veg", "comfort-food"],
    approxCostPerKg: 350, // ~₹220 per plate
    commonCookingVariations: ["Dum cooked with saffron and spices"]
  },
  {
    id: "khichdi_moong_dal",
    name: "Moong Dal Khichdi (Rice + Moong Dal + Ghee)",
    category: "Complete Meals",
    standardServingGrams: 250,
    servingUnit: "1 comfort bowl (250g)",
    per100g: { calories: 124, protein: 4.9, carbs: 20.8, fat: 2.6, fiber: 2.4, sugar: 0.6, sodium: 180 },
    micronutrients: { iron_mg: 1.8, calcium_mg: 25, potassium_mg: 160 },
    tags: ["easy-digest", "ayurvedic", "comfort-food", "vegetarian", "gluten-free"],
    approxCostPerKg: 90,
    commonCookingVariations: ["Comfort watery", "Vegetable loaded"]
  }
];

module.exports = {
  foodDatabase,
  findFoodById: (id) => foodDatabase.find(f => f.id === id),
  searchFoods: (query) => {
    if (!query) return foodDatabase.slice(0, 15);
    const q = query.toLowerCase();
    return foodDatabase.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    );
  }
};
