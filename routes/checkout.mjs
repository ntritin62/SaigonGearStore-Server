import express from 'express';
import {
  createPaymentIntent,
  configStripe,
  confirmPayment,
} from '../controllers/checkoutController.mjs';
import isAuth from '../middlewares/is-auth.mjs';
import getCartId from '../middlewares/get-cartId.mjs';

const router = express.Router();

router.get('/config', configStripe);
router.post('/create-payment-intent', isAuth, getCartId, createPaymentIntent);
router.post('/confirm-payment', isAuth, getCartId, confirmPayment);

export default router;
