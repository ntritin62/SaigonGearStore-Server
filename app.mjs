import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import multer from 'multer';
import { Category, Brand } from './models/category.mjs';
import Product from './models/product.mjs';
import Inventory from './models/inventory.mjs';
import { Address, User } from './models/user.mjs';
import Cart from './models/cart.mjs';

const app = express();

const fileStorage = multer.memoryStorage({});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res) => {
  res.send('hello');
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5sd0ofw.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => console.log(err));
