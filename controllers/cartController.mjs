import { createClient } from 'redis';
import Cart from '../models/cart.mjs';
import Product from '../models/product.mjs';

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
      `cart:${cart._id}`,
      `product:${product._id}`,
      product.quantity
    );
  } else {
    if (await client.HEXISTS(`cart:${cartId._id}`, `product:${product._id}`)) {
      await client.HINCRBY(
        `cart:${cartId._id}`,
        `product:${product._id}`,
        product.quantity
      );
    } else {
      await client.HSET(
        `cart:${cartId._id}`,
        `product:${product._id}`,
        product.quantity
      );
    }
  }
  await client.disconnect();
  res.status(200).json({
    message: 'Added to Cart successfully',
  });
};

export const deleteProductInCart = async (req, res, next) => {
  await client.connect();
  const cartId = req.cartId._id;
  const productId = req.body.productId;

  await client.HDEL(`cart:${cartId}`, `product:${productId}`);

  if (!(await client.EXISTS(`cart:${cartId}`))) {
    await cart.findOneAndDelete(cartId);
  }

  await client.disconnect();
  res.status(200).json({
    message: 'Deleted product in cart successfully',
  });
};

export const indeCreaseQuantityProductInCart = async (req, res, next) => {
  await client.connect();
  const type = req.params.type;
  const cartId = req.cartId._id.toString();
  const productId = req.body.productId;

  if (type === 'decrease') {
    await client.HINCRBY(`cart:${cartId}`, `product:${productId}`, -1);

    if ((await client.HGET(`cart:${cartId}`, `product:${productId}`)) == 0) {
      await client.HDEL(`cart:${cartId}`, `product:${productId}`, -1);
    }
  } else {
    await client.HINCRBY(`cart:${cartId}`, `product:${productId}`, 1);
  }
  await client.disconnect();
  res.status(200).json({
    message: `${type} product quantity in cart successfully`,
  });
};

export const getProductDataInCart = async (req, res, next) => {
  await client.connect();
  const cartId = req.cartId._id.toString();

  let productKeys = await client.HGETALL(`cart:${cartId}`);
  const productArray = Object.entries(productKeys).map(([key, value]) => {
    const productId = key.slice(key.indexOf(':') + 1);
    return {
      id: productId,
      quantity: value,
    };
  });

  const products = await Promise.all(
    productArray.map(async (productKey) => {
      let product = await Product.findById(productKey.id);
      product = { ...product, quantity: +productKey.quantity };
      return product;
    })
  );

  await client.disconnect();
  res.status(200).json({
    message: `fetch products in cart successfully`,
    products: products,
  });
};
