import express from 'express';
import {
  createPaymentIntent,
  configStripe,
} from '../controllers/checkoutController.mjs';
import isAuth from '../middlewares/is-auth.mjs';

const router = express.Router();

router.get('/config', configStripe);
router.post('/create-payment-intent', createPaymentIntent);

export default router;
