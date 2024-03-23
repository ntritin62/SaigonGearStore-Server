import express from 'express';
import { getAllOrders, updateOrder } from '../controllers/orderController.mjs';
import { getAllProducts } from '../controllers/productController.mjs';
import { addProduct, editProduct } from '../controllers/productController.mjs';

const router = express.Router();

router.get('/orders', getAllOrders);
router.get('/products', getAllProducts);
router.post('/product', addProduct);
router.put('/product/:productId', editProduct);
router.get('/orders', getAllOrders);
router.put('/order/:orderId', updateOrder);

export default router;
