import express from 'express';
import { getProductsByCategory } from '../controllers/productController.mjs';
const router = express.Router();

router.get('/:categoryName', getProductsByCategory);

export default router;
