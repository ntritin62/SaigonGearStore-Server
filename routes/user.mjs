import express from 'express';
import isAuth from '../middlewares/is-auth.mjs';
import { editUser } from '../controllers/userController.mjs';

const router = express.Router();

router.post('/edit-info', isAuth, editUser);

export default router;
