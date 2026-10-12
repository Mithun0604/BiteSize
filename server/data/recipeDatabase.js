/**
 * BiteSize Curated Recipes for Pantry-to-Plate AI
 * Designed for Indian and global kitchen staples, focusing on high nutrition, low cost, and minimal waste.
 */

const recipeDatabase = [
  {
    id: "palak_paneer_bhurji",
    title: "Quick Palak Paneer Bhurji",
    category: "High Protein",
    dietary: "vegetarian",
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 2,
    difficulty: "Easy",
    estimatedCostPerServing: 65,
    nutritionPerServing: {
      calories: 245,
      protein: 15.2,
      carbs: 6.8,
      fat: 17.5,
      fiber: 3.8
    },
    requiredIngredients: [
      { name: "Amul Malai Paneer", quantity: "150g", category: "Dairy & Eggs" },
      { name: "Fresh Palak (Spinach)", quantity: "200g", category: "Fresh Produce" },
      { name: "Onion & Tomato Combo", quantity: "1 medium", category: "Fresh Produce" }
    ],
    optionalPantrySpices: ["Cumin seeds", "Turmeric powder", "Garam masala", "Green chilies", "1 tsp Oil"],
    instructions: [
      "Finely chop the washed palak (spinach), onion, and tomato.",
      "Heat 1 tsp oil in a pan, crackle cumin seeds, sauté onions and tomatoes until soft.",
      "Add turmeric, salt, and spices, then fold in the chopped spinach. Cook for 3-4 minutes until wilted.",
      "Crumble fresh paneer into the pan and toss gently for 2 minutes on medium heat. Serve warm with rotis!"
    ]
  },
  {
    id: "dal_khichdi_moong",
    title: "Wholesome Moong Dal Khichdi",
    category: "Comfort & Recovery",
    dietary: "vegetarian",
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 3,
    difficulty: "Beginner",
    estimatedCostPerServing: 28,
    nutritionPerServing: {
      calories: 280,
      protein: 11.5,
      carbs: 52.0,
      fat: 3.5,
      fiber: 5.4
    },
    requiredIngredients: [
      { name: "Toor Dal (Pigeon Peas)", quantity: "100g", category: "Grains & Pulses" },
      { name: "Sona Masoori Rice", quantity: "150g", category: "Grains & Pulses" }
    ],
    optionalPantrySpices: ["Ghee", "Jeera / Cumin", "Hing / Asafoetida", "Ginger paste", "Turmeric"],
    instructions: [
      "Wash rice and dal together until water runs clear. Soak for 15 minutes.",
      "In a pressure cooker, temper ghee with cumin seeds and a pinch of hing.",
      "Add drained dal-rice mix, 4 cups water, salt, and turmeric.",
      "Cook on medium flame for 3 whistles. Whisk lightly and serve warm with curd!"
    ]
  },
  {
    id: "overnight_protein_oats",
    title: "Greek Yogurt & Banana Power Oats",
    category: "Energizing Breakfast",
    dietary: "vegetarian",
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    difficulty: "Zero-Cook",
    estimatedCostPerServing: 52,
    nutritionPerServing: {
      calories: 330,
      protein: 18.0,
      carbs: 54.0,
      fat: 4.8,
      fiber: 6.2
    },
    requiredIngredients: [
      { name: "Rolled Oats", quantity: "50g", category: "Grains & Pulses" },
      { name: "Greek Yogurt Natural", quantity: "100g", category: "Dairy & Eggs" },
      { name: "Toned Milk", quantity: "100ml", category: "Dairy & Eggs" },
      { name: "Robusta Bananas", quantity: "1 whole", category: "Fresh Produce" }
    ],
    optionalPantrySpices: ["Chia seeds", "Cinnamon powder", "1 tsp Honey"],
    instructions: [
      "In a mason jar or bowl, mix rolled oats, toned milk, and greek yogurt.",
      "Stir until well combined and refrigerate overnight or for at least 30 minutes.",
      "Top with sliced ripe banana and a dust of cinnamon before enjoying!"
    ]
  },
  {
    id: "spiced_makhana_trail",
    title: "Crispy Roasted Turmeric Makhana",
    category: "Low Calorie Snack",
    dietary: "vegan",
    prepTimeMinutes: 2,
    cookTimeMinutes: 6,
    servings: 2,
    difficulty: "Beginner",
    estimatedCostPerServing: 35,
    nutritionPerServing: {
      calories: 140,
      protein: 4.5,
      carbs: 22.0,
      fat: 3.5,
      fiber: 5.5
    },
    requiredIngredients: [
      { name: "Roasted Makhana", quantity: "60g", category: "Healthy Snacks" }
    ],
    optionalPantrySpices: ["1/2 tsp Ghee or Olive oil", "Turmeric powder", "Chaat masala", "Rock salt"],
    instructions: [
      "Heat ghee/oil in a thick-bottomed kadai.",
      "Add foxnuts (makhana) and roast on low flame for 5-6 minutes until crisp when pressed.",
      "Turn off the heat, sprinkle turmeric, rock salt, and chaat masala, and toss well."
    ]
  },
  {
    id: "spinach_dal_tadka",
    title: "Palak Dal Tadka (Spinach Lentil Broth)",
    category: "High Fiber & Iron",
    dietary: "vegan",
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 3,
    difficulty: "Easy",
    estimatedCostPerServing: 32,
    nutritionPerServing: {
      calories: 195,
      protein: 10.2,
      carbs: 28.5,
      fat: 4.2,
      fiber: 6.8
    },
    requiredIngredients: [
      { name: "Toor Dal (Pigeon Peas)", quantity: "150g", category: "Grains & Pulses" },
      { name: "Fresh Palak (Spinach)", quantity: "200g", category: "Fresh Produce" },
      { name: "Onion & Tomato Combo", quantity: "1 medium", category: "Fresh Produce" }
    ],
    optionalPantrySpices: ["Garlic cloves", "Mustard seeds", "Curry leaves", "Red chili powder"],
    instructions: [
      "Pressure cook toor dal with chopped palak and turmeric for 3 whistles.",
      "In a small pan, heat oil, crackle mustard seeds, crushed garlic, and curry leaves.",
      "Add chopped tomatoes and chili powder, sauté for 2 mins, then pour sizzling tempering over cooked dal.",
      "Simmer for 3 minutes. Perfect with brown or white rice!"
    ]
  }
];

module.exports = { recipeDatabase };
