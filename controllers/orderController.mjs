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
  const orders = await Order.find({ status: false })
    .populate('products.productId')
    .populate('shipping')
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: 'Fetch all orders successfully',
    orders: orders,
  });
};

export const updateOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);
  order.status = true;
  await order.save();

  res.status(200).json({
    message: 'Confirmed the order successfully',
  });
};
