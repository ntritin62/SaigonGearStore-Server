import express from 'express';
import {
  getProductsByCategory,
  getProductsByCategoryOrBrands,
  searchProduct,
} from '../controllers/productController.mjs';
const router = express.Router();

router.get('', getProductsByCategoryOrBrands);
router.get('/search', searchProduct);
router.get('/:categoryName/:brand?', getProductsByCategory);

export default router;
