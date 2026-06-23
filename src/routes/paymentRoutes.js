// dish-drop-server/src/routes/paymentRoutes.js
import express from 'express';
import {
  createPremiumCheckout,
  createRecipePurchaseCheckout,
  handleWebhook,
  getUserPurchases,
  getPremiumStatus
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Webhook - Raw body required
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.post('/create-premium-checkout', protect, createPremiumCheckout);
router.post('/create-recipe-checkout/:recipeId', protect, createRecipePurchaseCheckout);
router.get('/purchased', protect, getUserPurchases);
router.get('/premium-status', protect, getPremiumStatus);

export default router;