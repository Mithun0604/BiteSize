const path = require('path');
const { foodDatabase, findFoodById } = require('../data/foodDatabase');

const MODEL_ID = 'onnx-community/swin-finetuned-food101-ONNX';
const MODEL_REVISION = 'e5e50bfc6425aa546f3b4421ca8bd79d0dd610b8';
const MINIMUM_CONFIDENCE = 0.35;

// Only map labels when they describe the same food represented in our nutrition catalog.
const FOOD_LABELS = {
  samosa: 'samosa_potato',
  chicken_curry: 'chicken_curry_homestyle'
};

let classifierPromise;

class MealModelError extends Error {
  constructor(message, statusCode = 503, code = 'MEAL_MODEL_UNAVAILABLE') {
    super(message);
    this.name = 'MealModelError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

async function getClassifier() {
  if (!classifierPromise) {
    classifierPromise = (async () => {
      const { env, pipeline } = await import('@huggingface/transformers');
      // Vercel's filesystem is read-only except for /tmp. Cache the public model there.
      env.cacheDir = path.join('/tmp', 'bitesize-model-cache');
      env.useBrowserCache = false;
      env.useFSCache = true;
      return pipeline('image-classification', MODEL_ID, {
        revision: MODEL_REVISION,
        dtype: 'q4f16'
      });
    })().catch(error => {
      classifierPromise = undefined;
      console.error('Meal model initialization failed:', error.message);
      throw new MealModelError('The food model could not start. You can still choose a food manually.');
    });
  }
  return classifierPromise;
}

function nutritionFor(food, portionGrams) {
  const factor = portionGrams / 100;
  return {
    calories: Math.round(food.per100g.calories * factor),
    protein: +(food.per100g.protein * factor).toFixed(1),
    carbs: +(food.per100g.carbs * factor).toFixed(1),
    fat: +(food.per100g.fat * factor).toFixed(1),
    fiber: +(food.per100g.fiber * factor).toFixed(1),
    sugar: +(food.per100g.sugar * factor).toFixed(1),
    sodium: Math.round(food.per100g.sodium * factor)
  };
}

function makeCandidate(food, confidence) {
  const portionGrams = food.standardServingGrams || 150;
  return {
    candidateId: food.id,
    name: food.name,
    category: food.category,
    confidence,
    isTop: true,
    portionGrams,
    servingDescription: food.servingUnit,
    per100g: food.per100g,
    micronutrients: food.micronutrients,
    approxCostPerKg: food.approxCostPerKg,
    tags: food.tags,
    calculated: nutritionFor(food, portionGrams)
  };
}

function createScanResponse(label, confidence) {
  const normalizedLabel = String(label || '').toLowerCase().replace(/\s+/g, '_');
  const foodId = FOOD_LABELS[normalizedLabel];
  const food = foodId ? findFoodById(foodId) : null;
  const candidate = food && confidence >= MINIMUM_CONFIDENCE ? makeCandidate(food, confidence) : null;

  if (!candidate) {
    return {
      mealName: String(label || 'Food photo'),
      confidenceScore: Number(confidence) || 0,
      confidenceLevel: 'low',
      uncertaintyRange: 'Not available',
      isAIEstimated: true,
      needsManualSelection: true,
      clarificationNeeded: ['The photo model can suggest a food category, but it could not safely match it to the nutrition catalog. Search for the food below to continue.'],
      candidates: [],
      ingredients: [],
      totals: null
    };
  }

  const calculated = candidate.calculated;
  return {
    mealName: candidate.name,
    primaryCandidateId: candidate.candidateId,
    confidenceScore: confidence,
    confidenceLevel: confidence >= 0.75 ? 'high' : 'medium',
    uncertaintyRange: confidence >= 0.75 ? 'Model category match; portion not estimated' : 'Review the food match',
    isAIEstimated: true,
    needsManualSelection: false,
    verifiedDataSource: 'BiteSize curated food database',
    clarificationNeeded: ['Confirm that this food is correct.', 'Set the portion size and any added oil, sauce, or toppings.'],
    cookingMethod: 'Not identified',
    candidates: [candidate],
    ingredients: [{
      name: candidate.name,
      verifiedDatabaseMatch: candidate.name,
      portionGrams: candidate.portionGrams,
      servingUnit: candidate.servingDescription,
      confidence,
      ...calculated
    }],
    totals: calculated
  };
}

async function analyzeMealImage({ imagePath: filePath }) {
  if (!filePath) throw new MealModelError('Please upload a valid meal photo.', 400, 'IMAGE_REQUIRED');

  try {
    const sharpModule = await import('sharp');
    const sharp = sharpModule.default;
    const metadata = await sharp(filePath, { limitInputPixels: 20000000 }).metadata();
    if (!metadata.width || !metadata.height || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
      throw new MealModelError('This file is not a readable JPG, PNG, or WebP image. Please choose another photo.', 422, 'INVALID_IMAGE');
    }
    const classifier = await getClassifier();
    const predictions = await classifier(filePath, { top_k: 1 });
    const prediction = Array.isArray(predictions) ? predictions[0] : null;
    if (!prediction || typeof prediction.label !== 'string' || !Number.isFinite(prediction.score)) {
      throw new MealModelError('The food model returned an unreadable result. Choose a food manually.', 503, 'MEAL_MODEL_BAD_RESPONSE');
    }
    return createScanResponse(prediction.label, prediction.score);
  } catch (error) {
    if (error instanceof MealModelError) throw error;
    if (error.name === 'Error' && (error.message.includes('Input buffer') || error.message.includes('unsupported image format') || error.message.includes('pixel limit'))) {
      throw new MealModelError('This photo could not be read. Please choose a valid JPG, PNG, or WebP image.', 422, 'INVALID_IMAGE');
    }
    console.error('Meal inference failed:', error.message);
    throw new MealModelError('Photo analysis is unavailable right now. You can choose a food manually.');
  }
}

module.exports = {
  analyzeMealImage,
  createScanResponse,
  getClassifier,
  MealModelError,
  MODEL_ID,
  MODEL_REVISION,
  MINIMUM_CONFIDENCE
};
