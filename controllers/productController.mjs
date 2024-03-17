import Product from '../models/product.mjs';
import { Category } from '../models/category.mjs';

export const getProductsByCategory = async (req, res, next) => {
  const cateName = req.params.categoryName;
  //   console.log(req.params);
  try {
    const cateId = await Category.findOne({ categoryName: cateName }).select(
      '_id'
    );
    if (!cateId) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    const products = await Product.find({ category: cateId })
      .populate('brand')
      .select('-category');

    res.status(200).json({
      message: 'Products fetched successfully',
      products,
    });
  } catch (err) {
    next(err);
  }
};
