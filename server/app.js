require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDatabase } = require('./config/database');
const { seedDemoUser } = require('./data/seedData');
const upload = require('./middleware/upload');
const { authenticateToken } = require('./middleware/auth');

// Controllers
const authCtrl = require('./controllers/authController');
const mealCtrl = require('./controllers/mealController');
const receiptCtrl = require('./controllers/receiptController');
const coachCtrl = require('./controllers/coachController');
const compareCtrl = require('./controllers/compareController');
const pantryCtrl = require('./controllers/pantryController');
const shoppingCtrl = require('./controllers/shoppingController');
const subCtrl = require('./controllers/subscriptionController');
const rewardsCtrl = require('./controllers/rewardsController');
const dashCtrl = require('./controllers/dashboardController');
const householdCtrl = require('./controllers/householdController');
const reportCtrl = require('./controllers/reportController');

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads directory
const isVercel = Boolean(process.env.VERCEL);
const uploadsDir = isVercel
  ? path.join('/tmp', 'uploads')
  : path.resolve(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Database auto-initializer for serverless environments
let dbInitialized = false;
const ensureDatabaseInitialized = async () => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      await seedDemoUser();
      dbInitialized = true;
    } catch (err) {
      console.error('Error during lazy DB initialization:', err);
    }
  }
};

app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    await ensureDatabaseInitialized();
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BiteSize Core Intelligence API',
    runtime: isVercel ? 'Vercel Serverless' : 'Node.js Express',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 1. Auth Routes
app.post('/api/auth/register', authCtrl.register);
app.post('/api/auth/login', authCtrl.login);
app.post('/api/auth/forgot-password', authCtrl.forgotPassword);
app.post('/api/auth/reset-password', authCtrl.resetPassword);
app.get('/api/auth/profile', authenticateToken, authCtrl.getProfile);
app.put('/api/auth/profile', authenticateToken, authCtrl.updateProfile);
app.delete('/api/auth/account', authenticateToken, authCtrl.deleteAccount);

// 2. Meal Scanner & Daily Nutrition Routes
app.post('/api/meals/scan', authenticateToken, upload.single('image'), mealCtrl.scanMeal);
app.post('/api/meals/confirm', authenticateToken, mealCtrl.confirmAndSaveMeal);
app.get('/api/meals', authenticateToken, mealCtrl.getMealsByDate);
app.get('/api/meals/all', authenticateToken, mealCtrl.getAllMeals);
app.delete('/api/meals/:id', authenticateToken, mealCtrl.deleteMeal);

// 3. Receipt Scanner & Grocery Routes
app.post('/api/receipts/scan', authenticateToken, upload.single('receipt'), receiptCtrl.scanReceipt);
app.post('/api/receipts/confirm', authenticateToken, receiptCtrl.confirmReceipt);
app.get('/api/receipts', authenticateToken, receiptCtrl.getReceipts);
app.get('/api/receipts/:id', authenticateToken, receiptCtrl.getReceiptDetails);
app.delete('/api/receipts/:id', authenticateToken, receiptCtrl.deleteReceipt);

// 4. BiteSize AI Coach Routes
app.post('/api/coach/chat', authenticateToken, coachCtrl.chat);
app.get('/api/coach/history', authenticateToken, coachCtrl.getHistory);
app.delete('/api/coach/history', authenticateToken, coachCtrl.clearHistory);

// 5. "What If I Changed This?" Comparison Routes
app.post('/api/compare/calculate', authenticateToken, compareCtrl.compareFoods);
app.get('/api/compare/curated', authenticateToken, compareCtrl.getCuratedSwaps);
app.post('/api/compare/add-to-shopping', authenticateToken, compareCtrl.addAlternativeToShoppingList);

// 6. Pantry-to-Plate AI & Pantry Management Routes
app.get('/api/pantry', authenticateToken, pantryCtrl.getPantry);
app.post('/api/pantry', authenticateToken, pantryCtrl.addPantryItem);
app.put('/api/pantry/:id', authenticateToken, pantryCtrl.updatePantryItem);
app.delete('/api/pantry/:id', authenticateToken, pantryCtrl.deletePantryItem);
app.get('/api/pantry/recipes', authenticateToken, pantryCtrl.getRecipeSuggestions);
app.post('/api/pantry/cook', authenticateToken, pantryCtrl.cookRecipe);
app.post('/api/pantry/add-missing', authenticateToken, pantryCtrl.addMissingToShoppingList);

// 7. Smart Shopping List Routes
app.get('/api/shopping', authenticateToken, shoppingCtrl.getShoppingList);
app.post('/api/shopping', authenticateToken, shoppingCtrl.addShoppingItem);
app.put('/api/shopping/:id/toggle', authenticateToken, shoppingCtrl.toggleItem);
app.put('/api/shopping/:id', authenticateToken, shoppingCtrl.updateItem);
app.delete('/api/shopping/:id', authenticateToken, shoppingCtrl.deleteItem);
app.delete('/api/shopping/clear/completed', authenticateToken, shoppingCtrl.clearChecked);

// 8. Subscription & Razorpay Payment Routes
app.get('/api/subscriptions/status', authenticateToken, subCtrl.getStatus);
app.post('/api/subscriptions/create-order', authenticateToken, subCtrl.createCheckout);
app.post('/api/subscriptions/verify-payment', authenticateToken, subCtrl.verifyPayment);
app.post('/api/subscriptions/cancel', authenticateToken, subCtrl.cancelSubscription);

// 9. Bite Currency Rewards & First Club Routes
app.get('/api/rewards', authenticateToken, rewardsCtrl.getRewardsStatus);
app.post('/api/rewards/redeem', authenticateToken, rewardsCtrl.redeemVoucher);

// 10. Dashboard Aggregated Route
app.get('/api/dashboard/overview', authenticateToken, dashCtrl.getDashboardOverview);

// 11. Household / Shared Bite Family Routes
app.get('/api/household', authenticateToken, householdCtrl.getHousehold);
app.post('/api/household', authenticateToken, householdCtrl.addHouseholdMember);
app.delete('/api/household/:id', authenticateToken, householdCtrl.removeHouseholdMember);

// 12. Analytics, Reports & Data Export Routes
app.get('/api/reports/analytics', authenticateToken, reportCtrl.getNutritionAndSpendReports);
app.get('/api/reports/export', authenticateToken, reportCtrl.exportUserData);

// Serve production client build if available (for standalone local execution)
const clientBuildPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = {
  app,
  ensureDatabaseInitialized
};
