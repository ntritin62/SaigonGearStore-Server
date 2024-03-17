import express from 'express';
import { getProductById } from '../controllers/productController.mjs';
const router = express.Router();

router.get('/:productId', getProductById);

export default router;
