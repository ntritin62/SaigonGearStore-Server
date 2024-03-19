import { createClient } from 'redis';
import Cart from '../models/cart.mjs';

const client = createClient({
  password: `${process.env.REDIS_PASSWORD}`,
  socket: {
    host: `${process.env.REDIS_HOST}`,
    port: `${process.env.REDIS_PORT}`,
  },
});

export const addToCart = async (req, res, next) => {
  await client.connect();

  const cartId = req.cartId;
  const userId = req.userId;
  const product = req.body.product;

  if (!cartId) {
    const cart = new Cart({
      userId,
      products: product,
    });
    await cart.save();

    const result = await client.HSET(
      `cart:${cart._id.toString()}`,
      `product:${product._id.toString()}`,
      product.quantity
    );
  } else {
    const cart = await Cart.findById(cartId);

    if (await client.HEXISTS(`cart:${cart._id}`, `product:${product._id}`)) {
      await client.HINCRBY(
        `cart:${cart._id}`,
        `product:${product._id}`,
        product.quantity
      );
      const productId = product._id;
      const productExists = cart.products.find(
        (product) => product._id.toString() === productId.toString()
      );

      productExists.quantity += product.quantity;
    } else {
      await client.HSET(
        `cart:${cart._id}`,
        `product:${product._id}`,
        product.quantity
      );
      cart.products.push(product);
    }
    await cart.save();
  }
  await client.disconnect();
  res.status(200).json({
    message: 'Added to Cart successfully',
  });
};

export const deleteProductInCart = async (req, res, next) => {
  await client.connect();
  const cartId = req.cartId;
  const productId = req.body.productId;

  const cart = await Cart.findById(cartId);

  const index = cart.products.findIndex(
    (product) => product._id.toString() === productId
  );

  if (index >= 0) {
    await client.HDEL(`cart:${cart._id}`, `product:${productId}`);
    cart.products.splice(index, 1);
    if (cart.products.length === 0) {
      await cart.deleteOne();
    } else {
      await cart.save();
    }
  }

  await client.disconnect();
  res.status(200).json({
    message: 'Deleted product in cart successfully',
  });
};
