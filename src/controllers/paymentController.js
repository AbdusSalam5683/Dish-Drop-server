// dish-drop-server/src/controllers/paymentController.js
import stripe from '../config/stripe.js';
import { STRIPE_PREMIUM_PRICE_ID } from '../config/stripe.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

// ==================== CREATE PREMIUM CHECKOUT ====================
export const createPremiumCheckout = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Check if user already premium
    if (req.user.isPremium) {
      return res.status(400).json({
        success: false,
        message: 'You are already a premium member'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        type: 'premium'
      }
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Create Premium Checkout Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session'
    });
  }
};

// ==================== CREATE RECIPE PURCHASE CHECKOUT ====================
export const createRecipePurchaseCheckout = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;
    const userEmail = req.user.email;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if already purchased
    const existingPurchase = await Payment.findOne({
      userId,
      recipeId,
      paymentStatus: 'completed'
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased this recipe'
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: recipe.recipeName,
              description: `Purchase recipe: ${recipe.recipeName}`,
              images: [recipe.recipeImage],
            },
            unit_amount: 299, // $2.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&recipe_id=${recipeId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        recipeId: recipeId,
        type: 'recipe_purchase'
      }
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Create Recipe Purchase Checkout Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session'
    });
  }
};

// ==================== WEBHOOK - HANDLE STRIPE EVENTS ====================
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object;
        await handleInvoicePaid(invoice);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== HANDLE CHECKOUT SESSION COMPLETED ====================
const handleCheckoutSessionCompleted = async (session) => {
  const { userId, recipeId, type } = session.metadata;

  if (type === 'premium') {
    // Update user to premium
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumSince: new Date()
    });

    await Payment.create({
      userEmail: session.customer_email,
      userId: userId,
      amount: session.amount_total / 100,
      transactionId: session.id,
      paymentStatus: 'completed',
      paidAt: new Date()
    });

    console.log(`✅ User ${userId} upgraded to premium`);

  } else if (type === 'recipe_purchase') {
    await Payment.create({
      userEmail: session.customer_email,
      userId: userId,
      recipeId: recipeId,
      amount: session.amount_total / 100,
      transactionId: session.id,
      paymentStatus: 'completed',
      paidAt: new Date()
    });

    console.log(`✅ User ${userId} purchased recipe ${recipeId}`);
  }
};

// ==================== HANDLE INVOICE PAID ====================
const handleInvoicePaid = async (invoice) => {
  const userId = invoice.metadata?.userId;
  
  if (userId) {
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumSince: new Date()
    });
    console.log(`✅ Premium renewed for user ${userId}`);
  }
};

// ==================== GET USER PURCHASES ====================
export const getUserPurchases = async (req, res) => {
  try {
    const purchases = await Payment.find({
      userId: req.user.id,
      paymentStatus: 'completed'
    })
    .populate('recipeId', 'recipeName recipeImage authorName')
    .sort({ paidAt: -1 });

    res.status(200).json({
      success: true,
      purchases
    });

  } catch (error) {
    console.error('Get User Purchases Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch purchases'
    });
  }
};

// ==================== GET USER PREMIUM STATUS ====================
export const getPremiumStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      isPremium: user?.isPremium || false,
      premiumSince: user?.premiumSince || null
    });

  } catch (error) {
    console.error('Get Premium Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get premium status'
    });
  }
};