import express from 'express';
import {
  getProductsByCategory,
  getProductsByCategoryOrBrands,
} from '../controllers/productController.mjs';
const router = express.Router();

router.get('', getProductsByCategoryOrBrands);
router.get('/:categoryName/:brand?', getProductsByCategory);

export default router;
