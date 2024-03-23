import Order from '../models/order.mjs';
import product from '../models/product.mjs';

export const getOrders = async (req, res, next) => {
  const userId = req.userId;

  const orders = await Order.find({ userId: userId })
    .select('-userId')
    .populate('products.productId')
    .populate('shipping')
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: 'Fetch orders successfully',
    orders: orders,
  });
};

export const getAllOrders = async (req, res, next) => {
  const orders = await Order.find()
    .populate('products.productId')
    .populate('shipping')
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: 'Fetch all orders successfully',
    orders: orders,
  });
};
