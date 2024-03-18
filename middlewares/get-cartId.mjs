import Cart from '../models/cart.mjs';

const getCartId = async (req, res, next) => {
  const userId = req.userId;
  let cartId;
  try {
    cartId = await Cart.findOne({ userId: userId }).select('_id');

    req.cartId = cartId;

    next();
  } catch (err) {
    next(err);
  }
};

export default getCartId;
