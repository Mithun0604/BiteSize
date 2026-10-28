const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createScanResponse, analyzeMealImage, MODEL_REVISION } = require('./aiVisionService');
const { findFoodById } = require('../data/foodDatabase');

test('uses catalog nutrition for a supported classifier label', () => {
  const result = createScanResponse('chicken_curry', 0.82);
  const food = findFoodById('chicken_curry_homestyle');

  assert.equal(result.needsManualSelection, false);
  assert.equal(result.candidates[0].candidateId, food.id);
  assert.equal(result.candidates[0].per100g, food.per100g);
  assert.equal(result.totals.calories, Math.round(food.per100g.calories * (food.standardServingGrams / 100)));
  assert.match(MODEL_REVISION, /^[a-f0-9]{40}$/);
});

test('requires manual selection instead of inventing nutrition for unmapped labels', () => {
  const result = createScanResponse('macarons', 0.91);

  assert.equal(result.needsManualSelection, true);
  assert.deepEqual(result.candidates, []);
  assert.equal(result.totals, null);
});

test('requires manual selection for low-confidence predictions', () => {
  const result = createScanResponse('samosa', 0.2);

  assert.equal(result.needsManualSelection, true);
  assert.deepEqual(result.candidates, []);
});

test('rejects corrupt image data with a clear client error', async () => {
  const imagePath = path.join(os.tmpdir(), `bitesize-invalid-${Date.now()}.jpg`);
  fs.writeFileSync(imagePath, 'not an image');

  try {
    await assert.rejects(
      analyzeMealImage({ imagePath }),
      error => error.statusCode === 422 && error.code === 'INVALID_IMAGE'
    );
  } finally {
    fs.rmSync(imagePath, { force: true });
  }
});
