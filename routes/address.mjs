import express from 'express';
import isAuth from '../middlewares/is-auth.mjs';
import { addAddress } from '../controllers/addressController.mjs';

const router = express.Router();

router.post('', isAuth, addAddress);

export default router;
