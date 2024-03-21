import express from 'express';
import isAuth from '../middlewares/is-auth.mjs';
import { getOrders } from '../controllers/orderController.mjs';

const router = express.Router();

router.get('', isAuth, getOrders);

export default router;
