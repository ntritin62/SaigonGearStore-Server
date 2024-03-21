import Order from '../models/order.mjs';

export const getOrders = async (req, res, next) => {
  const userId = req.userId;

  const orders = await Order.find({ userId: userId })
    .populate('products.productId')
    .populate('shipping');

  res.status(200).json({
    message: 'Fetch orders successfully',
    orders: orders,
  });
};
