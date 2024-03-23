import express from 'express';
import isAuth from '../middlewares/is-auth.mjs';
import { getAllOrders } from '../controllers/orderController.mjs';
import { getAllProducts } from '../controllers/productController.mjs';
import { addProduct } from '../controllers/productController.mjs';

const router = express.Router();

router.get('/orders', getAllOrders);
router.get('/products', getAllProducts);
router.post('/product', addProduct);

export default router;
