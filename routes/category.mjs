import express from 'express';
import { getBrands } from '../controllers/categoryController.mjs';

const router = express.Router();

router.get('/:categoryName', getBrands);

export default router;
