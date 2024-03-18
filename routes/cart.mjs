import express from 'express';
import isAuth from '../middlewares/is-auth.mjs';
import getCartId from '../middlewares/get-cartId.mjs';
// import { getCart } from '../controllers/cartController.mjs';
import { addToCart } from '../controllers/cartController.mjs';

const router = express.Router();

router.post('', isAuth, getCartId, addToCart);

export default router;
