import Order from '../models/order.mjs';
import Stripe from 'stripe';
import { createClient } from 'redis';
import Product from '../models/product.mjs';
import Cart from '../models/cart.mjs';

const client = createClient({
  password: `${process.env.REDIS_PASSWORD}`,
  socket: {
    host: `${process.env.REDIS_HOST}`,
    port: `${process.env.REDIS_PORT}`,
  },
});

await client.connect();

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

export const configStripe = (req, res, next) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

export const createPaymentIntent = async (req, res, next) => {
  try {
    if (!req.cartId) {
      const error = new Error('CartId not found.');
      error.statusCode = 401;
      throw error;
    }
    const cartId = req.cartId._id;
    let productKeys = await client.HGETALL(`cart:${cartId}`);
    const productArray = Object.entries(productKeys).map(([key, value]) => {
      const productId = key.slice(key.indexOf(':') + 1);
      return {
        id: productId,
        quantity: value,
      };
    });

    let products = await Promise.all(
      productArray.map(async (productKey) => {
        let product = await Product.findById(productKey.id).populate('brand');
        product = { ...product, quantity: +productKey.quantity };
        return product;
      })
    );

    products = products.map(({ _doc, quantity }) => {
      return { ..._doc, quantity };
    });

    let totalPrice = 0;
    for (const product of products) {
      totalPrice +=
        (product.price - (product.sale / 100) * product.price) *
        product.quantity;
    }
    const amountInCents = Math.floor(totalPrice * 100);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'USD',
        amount: amountInCents,
        automatic_payment_methods: { enabled: true },
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (e) {
      next(e);
    }
  } catch (err) {
    next(err);
  }
};

export const confirmPayment = async (req, res, next) => {
  const cartId = req.cartId._id;
  const userId = req.userId;
  const cart = req.body.cart;

  await client.DEL(`cart:${cartId}`);
  await Cart.findOneAndDelete(cartId);
  const order = new Order({
    userId: userId,
    shipping: cart.address,
    amount: cart.totalPrice,
    products: cart.products,
  });
  await order.save();
  res.status(200).json({
    message: 'Payment success',
  });
};
