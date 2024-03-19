import express from 'express';
import isAuth from '../middlewares/is-auth.mjs';
import getCartId from '../middlewares/get-cartId.mjs';

import {
  addToCart,
  deleteProductInCart,
} from '../controllers/cartController.mjs';

const router = express.Router();

router.post('', isAuth, getCartId, addToCart);
router.delete('', isAuth, getCartId, deleteProductInCart);

export default router;
